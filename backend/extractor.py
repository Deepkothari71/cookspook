from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import time


def get_policy_text(driver, policy_link):
    """Scrape the full text of the privacy policy using Selenium."""
    try:
        driver.get(policy_link)
        time.sleep(3)

        soup = BeautifulSoup(driver.page_source, 'html.parser')
        for tag in soup(['script', 'style']):
            tag.decompose()

        text = ' '.join([p.get_text(strip=True) for p in soup.find_all(['p', 'div'])])
        return text.strip()

    except Exception as e:
        print(f"[!] Error scraping policy with Selenium: {e}")
        return None


def simple_string_matching(banner, policy_text):
    """Check if the banner text appears in the policy text."""
    if banner and policy_text:
        return banner.lower() in policy_text.lower()
    return False


def extract_info(url):
    """Extract cookie banner, opt-out option, and privacy policy link from a webpage."""
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    try:
        driver.get(url)
        time.sleep(3)

        soup = BeautifulSoup(driver.page_source, 'html.parser')

        # Extract cookie banner text
        banner_text = ""
        has_opt_out = False
        for tag in soup.find_all(['div', 'section', 'footer']):
            if tag.get_text():
                text = tag.get_text().strip()
                if 'cookie' in text.lower() and 20 < len(text) < 500:
                    banner_text = text
                    print(f"[+] Extracted banner: {banner_text}")

                    # Check for opt-out phrases
                    opt_out_phrases = ['reject','reject all', 'opt out', 'decline', 'deny' , 'disagree','REJECT ALL' ,'Reject All'] #'manage preferences'
                    has_opt_out = any(phrase in text.lower() for phrase in opt_out_phrases)

                    break

        # Extract privacy policy link
        policy_link = ""
        for a in soup.find_all('a', href=True):
            if "privacy" in a.get_text().lower() or "policy" in a['href'].lower():
                policy_link = urljoin(url, a['href'])
                print(f"[+] Found policy link: {policy_link}")
                break

        if banner_text and policy_link:
            policy_text = get_policy_text(driver, policy_link)

            if policy_text:
                is_match = simple_string_matching(banner_text, policy_text)
                return {
                    "banner": banner_text,
                    "policy_link": policy_link,
                    "policy_text": policy_text[:500],
                    "url": url,
                    "banner_in_policy": is_match,
                    "has_opt_out": has_opt_out
                }
            else:
                print("[!] Could not extract policy text.")
                return None
        else:
            print("[!] Could not find cookie banner or policy link.")
            return None

    except Exception as e:
        print(f"[!] Error while processing {url}: {e}")
        return None

    finally:
        driver.quit()
