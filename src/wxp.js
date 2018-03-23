import App from './app'
const wxp = new App()

wxp.$init(wxp)
wxp.use('promisify')
wxp.use('requestfix')
export default wxp