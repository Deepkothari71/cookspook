import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import time
import re

def get_policy_text(policy_link):
    """Scrape the full text of the privacy policy using lightweight requests instead of Selenium"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(policy_link, headers=headers, timeout=15)
        if response.status_code != 200:
            print(f"[!] Failed to retrieve policy ({response.status_code})")
            return None

        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Remove script and style elements
        for tag in soup(['script', 'style', 'nav', 'header', 'footer']):
            tag.decompose()

        # Extract text from paragraphs and divs
        text_elements = soup.find_all(['p', 'div', 'section', 'article'])
        policy_text = ' '.join([elem.get_text(strip=True) for elem in text_elements if elem.get_text(strip=True)])
        
        return policy_text.strip()

    except Exception as e:
        print(f"[!] Error scraping policy: {e}")
        return None

def simple_string_matching(banner, policy_text):
    """Check if the banner text appears in the policy text."""
    if banner and policy_text:
        return banner.lower() in policy_text.lower()
    return False

def extract_cookie_banner(soup, url):
    """Extract cookie banner text using multiple strategies"""
    banner_text = ""
    has_opt_out = False
    
    # Strategy 1: Look for common cookie banner selectors
    cookie_selectors = [
        '[class*="cookie"]', '[id*="cookie"]', '[class*="banner"]', '[id*="banner"]',
        '[class*="consent"]', '[id*="consent"]', '[class*="gdpr"]', '[id*="gdpr"]',
        '[class*="privacy"]', '[id*="privacy"]'
    ]
    
    for selector in cookie_selectors:
        try:
            elements = soup.select(selector)
            for element in elements:
                text = element.get_text(strip=True)
                if text and len(text) > 20 and len(text) < 1000:
                    if any(keyword in text.lower() for keyword in ['cookie', 'consent', 'gdpr', 'privacy']):
                        banner_text = text
                        print(f"[+] Extracted banner with selector {selector}: {banner_text[:120]}...")
                        
                        # Check for opt-out phrases
                        opt_out_phrases = ['reject', 'reject all', 'opt out', 'decline', 'deny', 'disagree', 'REJECT ALL', 'Reject All']
                        has_opt_out = any(phrase in text.lower() for phrase in opt_out_phrases)
                        break
            if banner_text:
                break
        except Exception as e:
            continue
    
    # Strategy 2: Look for text containing cookie-related keywords
    if not banner_text:
        for tag in soup.find_all(['div', 'section', 'footer', 'aside']):
            if tag.get_text():
                text = tag.get_text().strip()
                if (len(text) > 20 and len(text) < 1000 and 
                    any(keyword in text.lower() for keyword in ['cookie', 'consent', 'gdpr', 'privacy', 'accept', 'reject'])):
                    banner_text = text
                    print(f"[+] Extracted banner with keyword search: {banner_text[:120]}...")
                    
                    # Check for opt-out phrases
                    opt_out_phrases = ['reject', 'reject all', 'opt out', 'decline', 'deny', 'disagree', 'REJECT ALL', 'Reject All']
                    has_opt_out = any(phrase in text.lower() for phrase in opt_out_phrases)
                    break
    
    return banner_text, has_opt_out

def find_policy_link(soup, base_url):
    """Find privacy policy link using multiple strategies"""
    policy_link = ""
    
    # Strategy 1: Look for links with privacy/policy in text or href
    for a in soup.find_all('a', href=True):
        link_text = a.get_text().lower().strip()
        href = a['href'].lower()
        
        if any(keyword in link_text for keyword in ['privacy', 'policy', 'terms', 'legal']):
            policy_link = urljoin(base_url, a['href'])
            print(f"[+] Found policy link with text: {policy_link}")
            break
        elif any(keyword in href for keyword in ['privacy', 'policy', 'terms', 'legal']):
            policy_link = urljoin(base_url, a['href'])
            print(f"[+] Found policy link with href: {policy_link}")
            break
    
    # Strategy 2: Look for common privacy policy URL patterns
    if not policy_link:
        common_paths = ['/privacy', '/privacy-policy', '/privacy-policy/', '/policy', '/terms', '/legal']
        parsed_url = urlparse(base_url)
        base_domain = f"{parsed_url.scheme}://{parsed_url.netloc}"
        
        for path in common_paths:
            try:
                test_url = base_domain + path
                response = requests.head(test_url, timeout=5)
                if response.status_code == 200:
                    policy_link = test_url
                    print(f"[+] Found policy link with common path: {policy_link}")
                    break
            except:
                continue
    
    return policy_link

def extract_info(url):
    """Extract cookie banner, opt-out option, and privacy policy link from a webpage."""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        print(f"[+] Processing URL: {url}")
        
        # Fetch the main page
        response = requests.get(url, headers=headers, timeout=15)
        if response.status_code != 200:
            print(f"[!] Failed to retrieve main page ({response.status_code})")
            return None

        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extract cookie banner
        banner_text, has_opt_out = extract_cookie_banner(soup, url)
        
        # Extract privacy policy link
        policy_link = find_policy_link(soup, url)
        
        if not banner_text:
            print("[!] Could not find cookie banner.")
            return None
            
        if not policy_link:
            print("[!] Could not find privacy policy link.")
            return None

        # Get policy text
        policy_text = get_policy_text(policy_link)
        
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

    except Exception as e:
        print(f"[!] Error while processing {url}: {e}")
        return None 