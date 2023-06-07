import time
from selenium import webdriver
from selenium.webdriver.common.by import By

driver = webdriver.Chrome()
url = "http://86.61.28.132:63400/presentation"
driver.get(url)

previous_url = driver.current_url

while True:
    try:
        current_url = driver.current_url

        print("pred if")
        if current_url != previous_url:
            previous_url = current_url

            iframe = None
            try:
                iframe = driver.find_element(By.ID, "webpack-dev-server-client-overlay")
            except:
                print("Ne najdem")

            if iframe:
                print("Najdem")
                close_button = iframe.find_element(By.CSS_SELECTOR, "button[style*=background-color]")
                close_button.click()

            time.sleep(5)
    except Exception as e:
        print(f"An error occurred: {e}")
        driver.quit()
        quit(1)