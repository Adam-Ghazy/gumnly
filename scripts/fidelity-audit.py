"""Capture live design evidence at the requested breakpoints."""
import asyncio, json, os
from pathlib import Path
from playwright.async_api import async_playwright
OUT=Path(os.environ.get('QA_OUTPUT','docs/fidelity-evidence'));OUT.mkdir(parents=True,exist_ok=True)
async def main():
 async with async_playwright() as p:
  browser=await p.chromium.launch(args=['--no-sandbox'])
  results=[]
  for label,url in [('reference','https://enchanting-eyes-327436.framer.app/'),('gumnly',os.environ.get('QA_URL','https://rawrc.mtex.my.id'))]:
   page=await browser.new_page()
   for width in [1440,834,390,320]:
    await page.set_viewport_size({'width':width,'height':1000 if width>800 else 844})
    await page.goto(url,wait_until='domcontentloaded',timeout=60000);await page.wait_for_timeout(4000);await page.evaluate('document.fonts.ready')
    await page.screenshot(path=str(OUT/f'{label}-{width}-hero.png'))
    for y in range(0,await page.evaluate('document.body.scrollHeight'),650):
     await page.evaluate('(y)=>scrollTo(0,y)',y);await page.wait_for_timeout(120)
    await page.wait_for_timeout(500)
    await page.screenshot(path=str(OUT/f'{label}-{width}-full.png'),full_page=True)
    data=await page.evaluate('''()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,items:[...document.querySelectorAll('h1,h2,h3,article,[data-framer-name]')].map(e=>{let s=getComputedStyle(e),r=e.getBoundingClientRect();return {tag:e.tagName,name:e.dataset.framerName||e.className,text:e.innerText?.slice(0,100),x:r.x,y:r.y+scrollY,w:r.width,h:r.height,bg:s.backgroundColor,color:s.color,border:s.border,borderVar:s.getPropertyValue('--border-color'),radius:s.borderRadius,padding:s.padding,font:s.font,fontSize:s.fontSize,gap:s.gap}}).filter(e=>e.w>0)})''')
    results.append({'site':label,**data})
    (OUT/'measurements.json').write_text(json.dumps(results,indent=2))
   await page.close()
  await browser.close()
asyncio.run(main())
