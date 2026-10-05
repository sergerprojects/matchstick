"""Public GovInfo archives; exact primary sponsors, HR/S bills in the 119th Congress."""
from pathlib import Path
from datetime import datetime, timezone
from concurrent.futures import ThreadPoolExecutor
import hashlib, io, json, re, urllib.request, zipfile, xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
NOW = datetime.now(timezone.utc).isoformat()
PEOPLE = {'M001222': ('Max Miller', 'hr'), 'M001242': ('Bernie Moreno', 's'), 'H001104': ('Jon Husted', 's')}
OUT = ROOT / 'lib/federal-legislation-snapshot.json'
try:
    prior = json.loads(OUT.read_text())
except FileNotFoundError:
    prior = {'groups': []}

def text(node, path):
    return node.findtext(path, '').strip()

def collect(chamber):
    url = f'https://www.govinfo.gov/bulkdata/BILLSTATUS/119/{chamber}/BILLSTATUS-119-{chamber}.zip'
    found = {ident: [] for ident, (_, c) in PEOPLE.items() if c == chamber}
    req = urllib.request.Request(url, headers={'User-Agent': 'Matchstick Wadsworth public-service source collector'})
    with urllib.request.urlopen(req, timeout=90) as response:
        raw = response.read(90_000_001)
    if len(raw) > 90_000_000:
        raise ValueError('Archive exceeds collection limit')
    with zipfile.ZipFile(io.BytesIO(raw)) as archive:
        files = [f for f in archive.infolist() if f.filename.endswith('.xml')]
        if len(files) < 100 or sum(f.file_size for f in files) > 600_000_000:
            raise ValueError('Unexpected archive shape or size')
        for file in files:
            if file.file_size > 8_000_000:
                raise ValueError('Oversized bill XML')
            data = archive.read(file)
            bill = ET.fromstring(data).find('bill')
            if bill is None or text(bill, 'congress') != '119' or text(bill, 'type').lower() != chamber:
                raise ValueError('Unexpected bill archive identity')
            sponsor = text(bill, 'sponsors/item/bioguideId')
            if sponsor not in found:
                continue
            number = text(bill, 'number')
            if not number.isdigit() or not text(bill, 'title') or text(bill, 'sponsors/item/state') != 'OH':
                raise ValueError('Incomplete sponsored bill')
            actions = [{'date': text(a, 'actionDate'), 'text': text(a, 'text'), 'code': text(a, 'actionCode'), 'type': text(a, 'type')} for a in bill.findall('actions/item')]
            codes = {a['code'] for a in actions}
            introduced = text(bill, 'introducedDate')
            if not re.fullmatch(r'\d{4}-\d{2}-\d{2}', introduced) or not actions:
                raise ValueError('Missing introduction/actions')
            milestone = lambda label, code: {'label': label, 'done': code in codes, 'date': next((a['date'] for a in reversed(actions) if a['code'] == code), '')}
            origin = 'House' if chamber == 'hr' else 'Senate'
            other = 'Senate' if chamber == 'hr' else 'House'
            passage = {'House': '8000', 'Senate': '17000'}
            signed = bool(codes & {'E30000'})
            law = bool(codes & {'36000', 'E40000'}) or bool(bill.findall('laws/item'))
            presented = bool(codes & {'28000', 'E20000'}) or signed or law
            milestones = [{'label': 'Introduced', 'done': True, 'date': introduced}, milestone(f'{origin} passed', passage[origin]), milestone(f'{other} passed', passage[other]), {'label': 'President', 'done': presented, 'date': next((a['date'] for a in reversed(actions) if a['code'] in {'28000', 'E20000'}), '')}, {'label': 'Law' if law and not signed else 'Signed', 'done': law or signed, 'date': next((a['date'] for a in reversed(actions) if a['code'] in {'E30000','36000','E40000'}), '')}]
            latest = {'date': text(bill, 'latestAction/actionDate'), 'text': text(bill, 'latestAction/text')}
            if not latest['date'] or not latest['text']:
                raise ValueError('Missing latest action')
            status = 'Became law' if law else 'Signed by the president' if signed else 'With the president' if presented else f'Both chambers passed · final action pending' if all(m['done'] for m in milestones[:3]) else f'Passed {origin} · {other} consideration' if milestones[1]['done'] else f'Introduced in the {origin}'
            if any(a['type'] == 'Veto' for a in actions) and not law:
                status = 'Vetoed · see recorded actions'
            elif not milestones[1]['done']:
                if 'Calendars' == actions[0]['type']:
                    status = f'On the {origin} calendar'
                elif bill.findall('committees/item'):
                    status = f'In {origin} committee'
            # CRS summaries remain attributed original-record context, never invented local benefit.
            summary = bill.find('summaries/summary')
            if summary is None:
                summary = bill.find('summaries/item')
            summary_text = re.sub('<[^>]+>', ' ', text(summary, 'text')) if summary is not None else ''
            found[sponsor].append({'bill': ('H.R. ' if chamber == 'hr' else 'S. ') + number, 'number': int(number), 'title': text(bill, 'title'), 'url': text(bill, 'legislationUrl'), 'evidenceUrl': f'https://www.govinfo.gov/bulkdata/BILLSTATUS/119/{chamber}/BILLSTATUS-119{chamber}{number}.xml', 'sourceHash': hashlib.sha256(data).hexdigest(), 'representative': PEOPLE[sponsor][0], 'role': 'Sponsor', 'bioguideId': sponsor, 'level': 'Federal', 'jurisdiction': 'Federal', 'session': '119th Congress', 'origin': origin, 'introduced': introduced, 'updated': text(bill, 'updateDate'), 'latestAction': latest, 'status': status, 'milestones': milestones, 'actions': actions, 'summary': ' '.join(summary_text.split())[:14000]})
    groups = []
    for ident, records in found.items():
        if not records:
            raise ValueError(f'Unexpected empty archive result for {PEOPLE[ident][0]}')
        groups.append({'representative': PEOPLE[ident][0], 'bioguideId': ident, 'level': 'Federal', 'session': '119th Congress', 'sourceUrl': url, 'archiveHash': hashlib.sha256(raw).hexdigest(), 'records': sorted(records, key=lambda r: (r['latestAction']['date'], r['number']), reverse=True), 'collectedAt': NOW, 'lastAttempt': NOW, 'status': 'ok'})
    return groups

groups = []
with ThreadPoolExecutor(max_workers=2) as pool:
    futures = {c: pool.submit(collect, c) for c in ['hr','s']}
    for chamber, future in futures.items():
        try:
            result = future.result()
            groups.extend(result)
            print(f'{chamber}: ' + ', '.join(f"{g['representative']} {len(g['records'])} sponsored bills" for g in result))
        except Exception as error:
            affected = {name for name, c in PEOPLE.values() if c == chamber}
            old = [g for g in prior['groups'] if g['representative'] in affected]
            if len(old) != len(affected):
                raise
            groups.extend([{**g, 'lastAttempt': NOW, 'status': 'stale', 'error': str(error)} for g in old])
            print(f'{chamber}: retained successful snapshot ({error})')
temporary=OUT.with_suffix('.next.json')
temporary.write_text(json.dumps({'congress':119, 'groups':groups}, indent=2) + '\n')
temporary.replace(OUT)
