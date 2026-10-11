import asyncio,json,os
from pathlib import Path
from playwright.async_api import async_playwright
async def main():
 out=Path(os.environ.get('QA_OUTPUT','docs/fidelity-evidence/final'));out.mkdir(parents=True,exist_ok=True)
 results=[];errors=[]
 async with async_playwright() as p:
  b=await p.chromium.launch(args=['--no-sandbox']);page=await b.new_page();page.on('pageerror',lambda e:errors.append(str(e)))
  for w in [1440,834,390,320]:
   await page.set_viewport_size({'width':w,'height':1000 if w>800 else 844});await page.goto(os.environ.get('QA_URL','http://127.0.0.1:37922'),wait_until='networkidle');await page.wait_for_timeout(1600)
   await page.screenshot(path=str(out/f'{w}-hero.png'))
   for y in range(0,await page.evaluate('document.body.scrollHeight'),600):
    await page.evaluate('(y)=>scrollTo(0,y)',y);await page.wait_for_timeout(100)
   await page.wait_for_timeout(500);await page.screenshot(path=str(out/f'{w}-full.png'),full_page=True)
   data=await page.evaluate('''()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,rectangles:[...document.querySelectorAll('.home-hero-panel,h1,.home-benefit-card,.expertise-cell article,.home-project,.home-button,.home-faq-item')].map(e=>{let s=getComputedStyle(e),r=e.getBoundingClientRect();return {name:e.className||e.tagName,w:r.width,h:r.height,x:r.x,y:r.y+scrollY,border:s.border,bg:s.backgroundColor,font:s.fontSize,line:s.lineHeight,overflow:e.scrollWidth>e.clientWidth+1}})})''')
   for r in data['rectangles']:
    assert r['x']>=-1 and r['x']+r['w']<=w+1,(w,r)
    assert not r['overflow'],(w,r)
   cards=[r for r in data['rectangles'] if r['name']=='home-benefit-card'];assert max(r['h'] for r in cards)-min(r['h'] for r in cards)<1
   results.append(data)
  assert not errors,errors
  (out/'geometry.json').write_text(json.dumps({'results':results,'pageErrors':errors},indent=2));await b.close()
 print('Geometry, equal cards, no clipped containers: passed 1440/834/390/320')
asyncio.run(main())
