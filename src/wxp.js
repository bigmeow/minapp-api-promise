import CoreClass from './core';
const wxp = new CoreClass();
wxp.$init(wxp);
wxp.use('promisify');
wxp.use('requestfix');
export default wxp