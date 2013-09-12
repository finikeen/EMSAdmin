component displayname="FormCollectionsAPI" extends="AbstractCollectionsAPI" taffy_uri="/forms" hint="returns all forms"
{	
	variables.service = Application.emsadmin.objectFactory.getObjectByName("Form","service","emsadmin");
    
	public any function get()
	{
		var fc = variables.service;
		
		result = fc.getAll();
	
		return representationOf(result).withStatus(200);
	}
}
