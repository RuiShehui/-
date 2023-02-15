export function export_excel_file(export_data,list_name){
  let link=document.createElement('a')
  let blogw=new Blob([export_data],{type:"application/vnd.ms-excel"})
  let objectUrl=window.URL.createObjectURL(blogw)
  link.href=objectUrl
  let file_name=`${list_name}`
  link.download=file_name
  link.click()
  window.URL.revokeObjectURL(objectUrl)
}