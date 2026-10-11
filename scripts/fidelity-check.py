import asyncio,os,json
from pathlib import Path
from playwright.async_api import async_playwright
async def main():
 results=[];failures=[]
 async with async_playwright() as p:
  b=await p.chromium.launch(args=['--no-sandbox']);page=await b.new_page()
  for w in [1440,834,390,320]:
   await page.set_viewport_size({'width':w,'height':1000});await page.goto(os.environ.get('QA_URL','https://rawrc.mtex.my.id'),wait_until='domcontentloaded');await page.wait_for_timeout(2000)
   await page.locator('.home-benefit-grid').scroll_into_view_if_needed();await page.wait_for_timeout(600)
   data=await page.evaluate('''()=>({width:innerWidth,headline:document.querySelector('h1').textContent,cards:[...document.querySelectorAll('.home-benefit-card')].map(e=>{let r=e.getBoundingClientRect(),s=getComputedStyle(e);return {w:r.width,h:r.height,x:r.x,border:s.border,color:s.borderColor,bg:s.backgroundColor}})})''')
   results.append(data)
   if data['headline']!='SaaS products. Services that deliver.':failures.append(f'{w}: English reference headline')
   if max(c['h'] for c in data['cards'])-min(c['h'] for c in data['cards'])>1:failures.append(f'{w}: unequal cards')
   for c in data['cards']:
    if c['color']!='rgb(224, 226, 230)':failures.append(f'{w}: reference border color')
    if c['x']<0 or c['x']+c['w']>w:failures.append(f'{w}: clipped card')
  await b.close()
 Path(os.environ.get('QA_RESULT','docs/fidelity-evidence/check-before.json')).write_text(json.dumps({'results':results,'failures':failures},indent=2))
 print(json.dumps({'results':results,'failures':failures},indent=2));assert not failures,failures
asyncio.run(main())
