component displayname="AccessTypesMemberAPI" extends="emsadmin.api.1.resources.AbstractRestAPI" taffy_uri="/AccessTypes/{id}"
{	
	variables.service = Application.security.objectFactory.getObjectByName("AccessTypes","service","security");
    variables.entityName = "AccessTypes";
	    
    public any function get(required string id)
	{
        var result = "";
		var data = StructNew();
		data.id = arguments.id;
		result = variables.dataTypeUtil.formatApiRecords( variables.service.getByID(data) );
        
        return representationOf( result ).withStatus(200);
	}
	
    public any function put()
	{
		var struct = deserializeJson( serializeJson( arguments ) );
		// temp = StructDelete( struct, "id");  // delete any unnecessary fields from Json before saving an entity
		result = variables.service.save( EntityNew(variables.entityName, struct) );      
        return representationOf( result ).withStatus(200);
	}
	
    public any function delete(required string id)
	{
		var result = "";
		var data = StructNew();
		data.id = arguments.id;
		result = variables.service.delete( data );
        return representationOf( result ).withStatus(200);
	}
}
