function export_excel_file(export_data,list_name){
  let link=document.createElement('a')
  let blogw=new Blob([export_data],{type:"application/vnd.ms-excel"})
  let objectUrl=window.URL.createObjectURL(blogw)
  link.href=objectUrl
  let file_name=`${list_name}.xlsx`
  link.download=file_name
  link.click()
  window.URL.revokeObjectURL(objectUrl)
}

function downUrl(url) {
  if (url) {
    const link = document.createElement('a');
    link.download = location.protocol + '//' + location.host + url
    link.setAttribute('href', location.protocol + '//' + location.host + url)
    link.style.display = 'none';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  return
}
export {
  downUrl,
  export_excel_file
}