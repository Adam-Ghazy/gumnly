import asyncio,json
from pathlib import Path
from playwright.async_api import async_playwright
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(args=['--no-sandbox']);page=await b.new_page(viewport={'width':1440,'height':1000})
  await page.goto('https://enchanting-eyes-327436.framer.app/',wait_until='domcontentloaded');await page.wait_for_timeout(4000)
  result=await page.evaluate('''()=>({surfaces:[...document.querySelectorAll('body,body>*,[data-framer-name="Card 1"],[data-framer-name="Card 1"] *,[data-framer-name="Trailing card"],h1,p')].slice(0,170).map(e=>{let s=getComputedStyle(e),a=getComputedStyle(e,'::after');return {name:e.dataset.framerName||e.tagName,text:e.innerText?.slice(0,60),background:s.background,color:s.color,border:s.border,afterBorder:a.border,shadow:s.boxShadow,font:s.font}}),images:[...document.images].map(e=>({src:e.src,alt:e.alt,w:e.width,h:e.height})),body:getComputedStyle(document.body).background})''')
  Path('docs/fidelity-evidence/reference-details.json').write_text(json.dumps(result,indent=2));print(json.dumps(result,indent=2));await b.close()
asyncio.run(main())
