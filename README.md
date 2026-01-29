# Google Form 手機友善外觀換殼（Apps Script）

## 解決方案架構（摘要）
本方案使用 Google Apps Script Web App 作為「外觀換殼」層。使用者只需貼上原本 Google Form 連結，前端會呼叫 Apps Script 讀取表單內容（題目、題型、選項與順序）並渲染成手機優先 UI。提交時由 Apps Script 以伺服器端 `POST` 回寫到原本的 `formResponse` 入口，確保結果仍回到原 Form 與同一份 Google Sheet，不建立新問卷也不另存資料。

前端採 Mobile-first 設計，針對 1–5 評分題（Linear Scale）提供大按鈕、橫向排列與清晰數字。其他題型如單選、多選、文字題會依原始題目完整呈現。所有選項文字與順序完全取自原始 Form，不做改寫。

## 技術流程圖（文字版）
1. 使用者貼上 Google Form 連結
2. Web App 前端呼叫 `getFormDefinition(formUrl)`
3. Apps Script 使用 `FormApp.openByUrl` 取得題目/選項/題型/ID
4. 前端依題型渲染手機介面（包含 1–5 評分大按鈕）
5. 使用者送出
6. 前端呼叫 `submitResponse(formUrl, responses)`
7. Apps Script 將 `entry.<itemId>` 組成 `formResponse` POST
8. 回寫原 Form，資料進入原本的 Google Sheet

## 部署與使用步驟
1. 建立新的 Google Apps Script 專案
2. 將 `appscript/Code.gs` 內容貼到專案中（覆蓋原本內容）
3. 建立 HTML 檔案 `Index.html`，貼上 `appscript/Index.html` 內容
4. 於 Apps Script 中選擇「部署」→「新增部署」→「網頁應用程式」
   - 執行身分：**我**
   - 具有存取權的使用者：**任何人**
5. 完成部署後取得 Web App 連結
6. 將此 Web App 連結提供給使用者
7. 使用者貼上原本 Google Form 連結 → 直接以手機友善介面填寫

## 如何操作（建立網頁流程）
1. 進入 [script.new](https://script.new) 建立 Apps Script 專案
2. 將 `Code.gs` 改成專案內的主檔名（預設即為 `Code.gs`）
3. 將 `appscript/Code.gs` 的內容完整貼上
4. 點選左側「新增檔案」→「HTML」，檔名輸入 `Index`（產生 `Index.html`）
5. 將 `appscript/Index.html` 的內容完整貼上並儲存
6. 點選右上角「部署」→「新增部署」→「網頁應用程式」
7. 設定如下：
   - 執行身分：**我**
   - 具有存取權的使用者：**任何人**
8. 首次部署需要授權，依照畫面指示授權即可
9. 取得 Web App 連結，該連結即為你的新「手機友善填寫」網頁
10. 開啟連結，在輸入欄貼上原本 Google Form 連結 → 讀取 → 填寫 → 送出

## 使用者操作說明
- **在哪裡貼 Google Form 連結？**
  - 進入 Web App 後，在「Google Form 連結」欄位貼上原始表單網址。
- **如何取得給使用者填寫的新連結？**
  - Web App 部署完成後的 URL 即為新的填寫連結，分享該連結即可。

## 常見錯誤排除
- **Exception: No HTML file named Index was found.**
  - 請確認你建立的 HTML 檔名是 **Index**（不是 `index` 或其他名稱）。Apps Script 會以 `HtmlService.createHtmlOutputFromFile('Index')` 讀取該檔案，檔名不一致就會出現此錯誤。
  - 建議：在 Apps Script 左側檔案清單中，確認有 `Index.html`（名稱顯示為 **Index**）。

## 重要原則
- ❌ 不建立新問卷
- ❌ 不更動原本 Google Form 結構
- ✅ 外觀換殼、資料原路回寫

## 支援題型
- 文字（Text）
- 段落（Paragraph Text）
- 單選（Multiple Choice）
- 多選（Checkbox）
- 線性評分（Linear Scale / 1–5）

> 若表單含有其他題型（如格狀題、日期題等），前端會顯示提示，請使用原始 Google Form 作答。
