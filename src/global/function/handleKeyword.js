const GlobalFunction = {
    searchEncode(key) {
       return key
          .replace(/%/g, "%25")
          .replace(/`/g, "%60")
          .replace(/#/g, "%23")
          .replace(/\^/g, "%5E")
          .replace(/&/g, "%26")
          .replace(/\+/g, "%2B")
          .replace(/\\/g, "%5C")
          .replace(/\|/g, "%7C")
          .replace(/}/g, "%7D")
          .replace(/]/g, "%5D")
          .replace(/{/g, "%7B")
          .replace(/\[/g, "%5B")
    }
 }
 
 export { GlobalFunction };