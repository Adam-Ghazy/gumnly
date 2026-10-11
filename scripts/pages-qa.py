"""Browser QA for public subpages (about/products/services/contact).
Requires Python Playwright. Usage: QA_URL=http://127.0.0.1:37922 python3 scripts/pages-qa.py"""
import asyncio, json, os
from pathlib import Path
from playwright.async_api import async_playwright

OUT = Path(os.environ.get('QA_OUTPUT', 'docs/page-evidence'))
OUT.mkdir(parents=True, exist_ok=True)
URL = os.environ.get('QA_URL', 'http://127.0.0.1:37922')
PAGES = {
    '/about': {'tag': 'About us', 'nav': 'About', 'checks': ['Approach', 'Principles', 'From an idea to a working product']},
    '/products': {'tag': 'Products', 'nav': 'Products', 'checks': ['In development']},
    '/services': {'tag': 'Services', 'nav': 'Services', 'checks': ['Three ways we can help', 'Custom software', 'Workflow automation', 'System integration']},
    '/contact': {'tag': 'Contact', 'nav': 'Contact', 'checks': ['Open to selected projects']},
}
VIEWPORTS = [('desktop', 1440, 1000), ('tablet', 834, 1080), ('mobile', 390, 844), ('narrow', 320, 844)]

async def settle(page):
    await page.wait_for_timeout(900)
    height = await page.evaluate('document.body.scrollHeight')
    for y in range(0, height, 600):
        await page.evaluate('(y)=>window.scrollTo(0,y)', y)
        await page.wait_for_timeout(120)
    await page.wait_for_timeout(500)

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(args=['--no-sandbox'])
        page = await browser.new_page()
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        results = []
        for route, spec in PAGES.items():
            for name, w, h in VIEWPORTS:
                await page.set_viewport_size({'width': w, 'height': h})
                await page.goto(URL + route, wait_until='networkidle')
                await settle(page)
                stem = route.strip('/') + '-' + name
                await page.evaluate('scrollTo(0,0)'); await page.wait_for_timeout(400)
                await page.screenshot(path=str(OUT / f'{stem}-hero.png'))
                await page.screenshot(path=str(OUT / f'{stem}-full.png'), full_page=True)
                body = await page.inner_text('body')
                assert await page.locator('h1').count() == 1, f'{route} h1 count'
                assert await page.locator('.gumnly-home').count() == 1, f'{route} wrapper missing'
                assert await page.locator('body>.site-header').evaluate('(x)=>getComputedStyle(x).display') == 'none', f'{route} old header visible'
                assert await page.locator('body>.site-footer').evaluate('(x)=>getComputedStyle(x).display') == 'none', f'{route} old footer visible'
                assert await page.locator('.home-nav').count() == 1, f'{route} pill nav missing'
                active = page.locator(f'.home-desktop-links a[href="{route}"]')
                if w >= 1200:
                    assert await active.get_attribute('aria-current') == 'page', f'{route} active nav missing'
                for text in [spec['tag'], *spec['checks']]:
                    assert text in body, f'{route} missing copy: {text}'
                assert 'Sevora' not in body and 'Stylokit' not in body
                overflow = await page.evaluate('document.documentElement.scrollWidth<=innerWidth')
                assert overflow, f'{route}/{name} horizontal overflow'
                images = await page.locator('img').evaluate_all('(xs)=>xs.filter(x=>getComputedStyle(x).display!=="none").every(x=>x.complete&&x.naturalWidth>0)')
                assert images, f'{route}/{name} broken image'
                results.append({'route': route, 'viewport': name, 'overflow': False, 'images': 'ok', 'oldChrome': 'hidden'})
        # products: filter interaction
        await page.set_viewport_size({'width': 1440, 'height': 1000})
        await page.goto(URL + '/products', wait_until='networkidle')
        await page.get_by_role('button', name='In development').click()
        await page.wait_for_timeout(300)
        assert await page.get_by_role('button', name='In development').get_attribute('aria-pressed') == 'true'
        results.append({'products': 'filter interaction passed'})
        # services: tabs
        await page.goto(URL + '/services', wait_until='networkidle')
        tab = page.get_by_role('tab', name='Workflow automation')
        await tab.click(); await page.wait_for_timeout(400)
        assert await tab.get_attribute('aria-selected') == 'true'
        results.append({'services': 'tabs passed'})
        # mobile menu on each page
        await page.set_viewport_size({'width': 390, 'height': 844})
        await page.goto(URL + '/services', wait_until='networkidle')
        await page.get_by_role('button', name='Open menu').click(); await page.wait_for_timeout(400)
        assert await page.get_by_role('navigation', name='Mobile navigation').is_visible()
        assert await page.locator('.home-mobile-menu a[href="/services"]').get_attribute('aria-current') == 'page'
        await page.get_by_role('button', name='Close menu').press('Escape'); await page.wait_for_timeout(400)
        results.append({'mobileMenu': 'active item + escape passed'})
        # reduced motion
        await page.emulate_media(reduced_motion='reduce')
        await page.goto(URL + '/about', wait_until='networkidle'); await page.wait_for_timeout(500)
        before = await page.evaluate('document.querySelector(".gumnly-home").getBoundingClientRect().height')
        await page.evaluate('window.scrollTo(0,800)'); await page.wait_for_timeout(600)
        after = await page.evaluate('document.querySelector(".gumnly-home").getBoundingClientRect().height')
        assert before == after
        results.append({'reducedMotion': 'no layout jump'})
        # contact form submit
        await page.emulate_media(reduced_motion='no-preference')
        await page.goto(URL + '/contact', wait_until='networkidle')
        await page.fill('#name', 'QA Browser')
        await page.fill('#email', 'qa@example.com')
        await page.fill('#message', 'Message uji dari QA browser otomatis untuk verifikasi penyimpanan.')
        await page.check('input[name="consent"]')
        await page.get_by_role('button', name='Send enquiry').click()
        await page.wait_for_timeout(1200)
        notice = await page.locator('.page-contact-form .notice').inner_text()
        assert 'Your enquiry is saved' in notice, notice
        results.append({'contactForm': notice.strip()})
        # smoke routes + api
        for route in ['/', '/about', '/products', '/services', '/contact', '/privacy', '/admin/login']:
            response = await page.goto(URL + route, wait_until='networkidle')
            assert response is not None and response.status == 200, route
        response = await page.request.get(URL + '/api/admin/company')
        assert response.status == 401
        results.append({'smoke': 'all routes 200', 'adminApi': 401})
        assert not errors, errors
        (OUT / 'pages-qa-results.json').write_text(json.dumps({'checks': results, 'pageErrors': errors}, indent=2, ensure_ascii=False))
        print(json.dumps(results, indent=2, ensure_ascii=False))
        await browser.close()

asyncio.run(main())
