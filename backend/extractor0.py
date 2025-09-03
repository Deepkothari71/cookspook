from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import requests
import time


def get_policy_text(policy_link):
    """Scrape the full text of the privacy policy from the policy link."""
    try:
        response = requests.get(policy_link, timeout=10)
        if response.status_code != 200:
            print(f"[!] Failed to retrieve policy ({response.status_code})")
            return None

        soup = BeautifulSoup(response.content, 'html.parser')
        for tag in soup(['script', 'style']):
            tag.decompose()

        text = ' '.join([p.get_text(strip=True) for p in soup.find_all(['p', 'div'])])
        return text.strip()

    except Exception as e:
        print(f"[!] Error scraping policy: {e}")
        return None


def simple_string_matching(banner, policy_text):
    """Check if the banner text appears in the policy text."""
    if banner and policy_text:
        return banner.lower() in policy_text.lower()
    return False


def extract_info(url):
    """Extract cookie banner and privacy policy link from a webpage."""
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
        for tag in soup.find_all(['div', 'section', 'footer']):
            if tag.get_text():
                text = tag.get_text().strip()
                if 'cookie' in text.lower() and 10 < len(text) < 1000:
                    banner_text = text
                    print(f"[+] Extracted banner: {banner_text[:120]}...")
                    break

        # Extract privacy policy link
        policy_link = ""
        for a in soup.find_all('a', href=True):
            link_text = a.get_text().lower()
            href = a['href'].lower()
            if "privacy" in link_text or "policy" in href:
                policy_link = urljoin(url, a['href'])
                print(f"[+] Found policy link: {policy_link}")
                break

        if banner_text and policy_link:
            policy_text = get_policy_text(policy_link)

            if policy_text:
                is_match = simple_string_matching(banner_text, policy_text)
                return {
                    "banner": banner_text,
                    "policy_link": policy_link,
                    "policy_text": policy_text[:500],
                    "url": url,
                    "banner_in_policy": is_match
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
