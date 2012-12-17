# OGC Climatology-Hydrology Information Sharing Pilot

## Last Value Service Definition
The last value service is a RESTfull like JSON webservice to perform CRUD operations on a hydrological sensors "last-value" repository. The standard HTTP methods like GET, POST, PUT and DELETE can be used to manipulate resources. 


####API key
An API key has to be retreived from the service in order to secure and isolate datasets. An API key can be requested by hitting the following URL:

``/svc/generate-key``

Future requests to the serivce will need to include the API key as a query string parameter with the key of "key" as in the URL examples below. Consumers will only be able to perform operation on their own datasets designated by the API key. 

####JSON Definition
````
{
	"stationId": "MH6654",
	"point": [51, -116],
	"recordedAt": "2010-04-20T20:08:21",
	"property": "level",
	"value": 20,
	"units": 
}	
````


- **stationId**: String identifier given to the station by the station authority.
- **point**: Latitude and Longitude of station in [lat, lon] format. Implied CRS is WGS84 in lat/lon.
- **recordedAt**: Datetime of recording in YYYY-MM-DDTHH:MM:SS formt.
- **property**: String representing name of property observed.
- **value**: Numeric value of property observed.

####URL Definition and Operations
Replace YOUR_API_KEY with API key retreived from generate key operation described above.

######Creating a record: 
POST``/svc/last-value?key=[YOUR_API_KEY]`` + JSON payload

######Retrieving a record: 
GET ``/svc/last-value?key=[YOUR_API_KEY]&stationId=MHB555``
Response format will be identical to JSON definition above with the exception of an additional *id* property. Which is the record's internal repositiry identifier that is used for DELETE operations. *Query filters* can be any of the JSON properties and in addition if recordedAt is omited the service will return the last recorded value.

######Updating a record: 
PUT ``/svc/last-value?key=[YOUR_API_KEY]`` + JSON payload

######Deleting a record: DELETE ``/svc/last-value?key=[YOUR_API_KEY]&id=c7fa1ecf-43c4-4e24-8b98-c8e24bd8be35``

For **deleting** a record you will first need to retreive it to get its internal identifier. A second request using the DELETE HTTP method can be made passing in the id as in the above example.




