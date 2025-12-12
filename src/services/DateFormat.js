export default 
{
    fullDate (newDate) {
      const options = {day: 'numeric' }
      const date = new Date(Date(newDate))
      return date.toDateString('en-US', options)
    },
    messageDate (newDate) {
      newDate = new Date(newDate * 1000)
      const ntime = newDate.getHours()
      const minutes = "0" + newDate.getMinutes()
      return ntime + ':' + minutes.substr(-2)
    },
    historyDate (newDate) {
      newDate = new Date(Date(newDate))
      const ntime = newDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
      const nday = newDate.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      return ntime
    }
    ,
    date_chart (value) 
    {
    //  newDate = new Date(Date(newDate))

     // const ntime = newDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
   //   const nday = newDate.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

   let vl = value.split("T");
   let vl_date = vl[0].split("-");
   let vl_time = vl[1].split(".");
   let vl_dt = vl_time[0].split(":");
   return (
     vl_date[2] + "/" + vl_date[1] + " " + vl_dt[0] + ":" + vl_dt[1]
   );



     }



}