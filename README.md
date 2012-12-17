## OGC Climatology-Hydrology Information Sharing Pilot

#### Last Value Service Definition
The last value service is a RESTfull like JSON webservice to perform CRUD operations on a hydrological sensors "last-value" repository. The standard HTTP methods like GET, POST, PUT and DELETE can be used to manipulate resources. 


###### JSON definition
````
{
	"stationId": "",
	"point": "",
	"recordedAt": "",
	"property": "",
	"value": "",
}	
````

- **stationId**: Identifier given to the station by the station authority.
- **point**: geoJSON point feature.
- **recordedAt**: datetime of recording.
- **property**: name of property observed.
- **value**: Value of property observed.

###### URL Definition

- **Creating a record**: POST /svc/last-value
- **Updating a record**: PUT /svc/last-value
- **Getting a record**: GET /svc/last-value?stationId=MHB555
- **Delete a record**: DELETE /svc/last-value?id=c7fa1ecf-43c4-4e24-8b98-c8e24bd8be35


Query filters can be any of the JSON properties and in addition if recordedAt is omited the service will return the last recorded value.


