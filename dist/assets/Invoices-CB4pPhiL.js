import{j as t}from"./motion-BjITASc6.js";import{L as j}from"./react-CYk5JloJ.js";import{P as b}from"./PageHeader-C8njl2e4.js";import{S as u}from"./StatusBadge-BxRn9kMi.js";import{u as g,aa as y,z as d,t as v,I as n,f as o,ab as w}from"./index-DqUAbgya.js";import{D as $}from"./download-DdI4SxRg.js";import{P as N}from"./printer-DfXOCoRe.js";import{F as L}from"./file-text-BhMmsCto.js";import"./Badge-CCjWLHJi.js";const r={zarinpal:"زرین‌پال",wallet:"کیف پول",cod:"پرداخت در محل"};function O(){const c=g(),h=()=>{window.print()},m=a=>{const x=a.itemsList.map(w).filter(Boolean).map(s=>{var l;return`<tr><td>${s.name}</td><td>${((l=s.brand)==null?void 0:l.name)||"—"}</td><td>۱</td><td>${n(s.price)}</td></tr>`}).join(""),p=`<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8" />
<title>فاکتور ${a.id}</title>
<style>
  body { font-family: Tahoma, sans-serif; max-width: 700px; margin: 40px auto; color: #0f172a; }
  h1 { color: #4f46e5; text-align: center; }
  table { width: 100%; border-collapse: collapse; margin-top: 24px; }
  th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: right; }
  th { background: #eef2ff; }
  .meta { display: flex; justify-content: space-between; margin-top: 16px; color: #475569; }
  .total { text-align: left; font-weight: bold; margin-top: 16px; }
</style>
</head>
<body>
  <h1>کفشینو — فاکتور رسمی فروش</h1>
  <div class="meta"><span>شماره فاکتور: ${a.id}</span><span>تاریخ: ${d(a.date)}</span></div>
  <div class="meta"><span>نام خریدار: ${a.userName}</span><span>روش پرداخت: ${r[a.payment]||a.payment}</span></div>
  <table>
    <thead><tr><th>نام محصول</th><th>برند</th><th>تعداد</th><th>مبلغ</th></tr></thead>
    <tbody>${x}</tbody>
  </table>
  <p class="total">مبلغ نهایی: ${n(a.total)}</p>
</body>
</html>`,f=new Blob([p],{type:"text/html;charset=utf-8"}),i=URL.createObjectURL(f),e=document.createElement("a");e.href=i,e.download=`invoice-${a.id}.html`,e.click(),URL.revokeObjectURL(i),c.success("فاکتور دانلود شد",`فاکتور ${a.id}`)};return t.jsxs("div",{children:[t.jsx(b,{eyebrow:"فاکتورها",title:"فاکتورهای خرید",description:"فاکتور تمام سفارش‌های خود را دانلود یا چاپ کنید."}),t.jsx("div",{className:"card-elevated overflow-hidden",children:t.jsx("div",{className:"overflow-x-auto",children:t.jsxs("table",{className:"data-table",children:[t.jsx("thead",{children:t.jsxs("tr",{children:[t.jsx("th",{children:"شماره فاکتور"}),t.jsx("th",{children:"تاریخ"}),t.jsx("th",{children:"تعداد اقلام"}),t.jsx("th",{children:"مبلغ"}),t.jsx("th",{children:"روش پرداخت"}),t.jsx("th",{children:"وضعیت"}),t.jsx("th",{children:"عملیات"})]})}),t.jsx("tbody",{children:y.map(a=>t.jsxs("tr",{children:[t.jsx("td",{children:t.jsx(j,{to:`/panel/orders/${a.id}`,className:"font-semibold text-brand-600 dark:text-brand-300",children:a.id})}),t.jsx("td",{children:d(a.date)}),t.jsxs("td",{children:[v(a.items)," کالا"]}),t.jsx("td",{className:"font-morabba font-bold text-foreground",children:n(a.total)}),t.jsx("td",{children:r[a.payment]||a.payment}),t.jsx("td",{children:t.jsx(u,{status:a.status})}),t.jsx("td",{children:t.jsxs("div",{className:"flex items-center gap-2",children:[t.jsx(o,{size:"xs",variant:"secondary",icon:$,onClick:()=>m(a),children:"دانلود"}),t.jsx(o,{size:"xs",variant:"ghost",icon:N,onClick:h,children:"چاپ"})]})})]},a.id))})]})})}),t.jsxs("div",{className:"mt-6 flex items-start gap-3 rounded-2xl border border-border/60 bg-surface p-5 text-sm",children:[t.jsx(L,{size:20,className:"mt-0.5 shrink-0 text-brand-500"}),t.jsx("p",{className:"leading-7 text-muted-foreground",children:"فاکتورهای دانلودشده دارای مهر و امضای دیجیتال نیستند. برای دریافت فاکتور رسمی با مهر شرکت، با پشتیبانی کفشینو در تماس باشید."})]})]})}export{O as default};
