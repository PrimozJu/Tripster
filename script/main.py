import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = webdriver.Chrome()
url = "http://86.61.28.132:63400/presentation"
driver.get(url)

previous_url = driver.current_url

while True:
    try:
        WebDriverWait(driver, 10).until(EC.url_changes(previous_url))

        current_url = driver.current_url

        if current_url != previous_url:
            previous_url = current_url

            iframe = None
            try:
                iframe = driver.find_element(By.ID, "webpack-dev-server-client-overlay")
            except:
                print("Element not found")

            if iframe:
                print("Element found")
                close_button = iframe.find_element(By.CSS_SELECTOR, "button[style*=background-color]")
                close_button.click()

    except Exception as e:
        print(f"An error occurred: {e}")
        driver.quit()
        quit(1)
