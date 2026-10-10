"""Browser acceptance and screenshot capture. Requires Python Playwright."""
import asyncio,json,os
from pathlib import Path
from playwright.async_api import async_playwright
OUT=Path(os.environ.get('QA_OUTPUT','docs/homepage-evidence'));OUT.mkdir(parents=True,exist_ok=True)
URL=os.environ.get('QA_URL','http://127.0.0.1:37922')
async def main():
 async with async_playwright() as p:
  b=await p.chromium.launch(args=['--no-sandbox']);page=await b.new_page()
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  results=[]
  for name,w,h in [('desktop',1440,1000),('tablet',810,1080),('mobile',390,844)]:
   await page.set_viewport_size({'width':w,'height':h});await page.goto(URL,wait_until='networkidle');await page.evaluate('window.scrollTo(0,0)');await page.wait_for_timeout(1800)
   await page.screenshot(path=str(OUT/f'{name}-hero.png'))
   assert await page.locator('h1').count()==1
   assert await page.locator('img[src="/reference/workspace.jpg"]').count()==1
   assert 'Sevora' not in await page.inner_text('body')
   assert await page.evaluate('document.documentElement.scrollWidth<=innerWidth')
   assert await page.locator('body>.site-header').evaluate('(x)=>getComputedStyle(x).display')=='none'
   for y in range(0,await page.evaluate('document.body.scrollHeight'),600):
    await page.evaluate('(y)=>window.scrollTo(0,y)',y);await page.wait_for_timeout(180)
   await page.wait_for_timeout(700);await page.screenshot(path=str(OUT/f'{name}-full.png'),full_page=True)
   assert await page.locator('img').evaluate_all('(xs)=>xs.filter(x=>getComputedStyle(x).display!=="none").every(x=>x.complete && x.naturalWidth>0)')
   tab=page.get_by_role('tab',name='Otomasi alur kerja');await tab.click();await page.wait_for_timeout(450);assert await tab.get_attribute('aria-selected')=='true'
   await tab.press('ArrowDown');assert await page.get_by_role('tab',name='Integrasi sistem').get_attribute('aria-selected')=='true'
   faq=page.get_by_role('button',name='Bagaimana cara mengajukan permintaan proyek?');await faq.click();await page.wait_for_timeout(400);assert await faq.get_attribute('aria-expanded')=='true'
   assert await page.locator('#faq-answer-0').evaluate('(x)=>x.getBoundingClientRect().height')>20
   await faq.click();await page.wait_for_timeout(400);assert await page.locator('#faq-answer-0').evaluate('(x)=>x.getBoundingClientRect().height')==0
   if name=='mobile':
    await page.get_by_role('button',name='Buka menu').click();await page.wait_for_timeout(400);assert await page.get_by_role('navigation',name='Navigasi mobile').is_visible()
    await page.get_by_role('button',name='Tutup menu').press('Escape');await page.wait_for_timeout(400);assert await page.get_by_role('navigation',name='Navigasi mobile').count()==0
   results.append({'viewport':name,'width':w,'height':h,'pageHeight':await page.evaluate('document.body.scrollHeight'),'overflow':False,'images':'loaded','services':'click and keyboard passed','faq':'open and close passed'})
  await page.emulate_media(reduced_motion='reduce');await page.goto(URL,wait_until='networkidle');await page.wait_for_timeout(600)
  before=await page.locator('.home-ticker-track').evaluate('(x)=>getComputedStyle(x).transform');await page.wait_for_timeout(300);after=await page.locator('.home-ticker-track').evaluate('(x)=>getComputedStyle(x).transform');assert before==after
  results.append({'reducedMotion':'ticker stopped; hero visible'})
  for route in ['/about','/products','/services','/contact','/privacy','/admin/login']:
   response=await page.goto(URL+route,wait_until='networkidle');assert response is not None and response.status==200
   assert await page.locator('body>.site-header').evaluate('(x)=>getComputedStyle(x).display')!='none'
   results.append({'route':route,'status':response.status,'homepageStyleLeak':False})
  response=await page.request.get(URL+'/api/admin/company');assert response.status==401
  results.append({'route':'/api/admin/company','status':401});assert not errors,errors
  (OUT/'qa-results.json').write_text(json.dumps({'checks':results,'pageErrors':errors},indent=2));print(json.dumps(results,indent=2));await b.close()
asyncio.run(main())
