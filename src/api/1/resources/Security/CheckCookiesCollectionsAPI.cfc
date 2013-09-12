component displayname="Security_CheckCookiesCollectionsAPI" extends="emsadmin.api.1.resources.AbstractRestAPI" taffy_uri="/checkCookies"
{	
	variables.service = Application.security.objectFactory.getObjectByName("security","service","security");
	    
	public any function get()
	{
		result = variables.service.checkCookies();
			      
        return representationOf( result ).withStatus(200);
	}
}