# OGC Climatology-Hydrology Information Sharing Pilot

## Caching Service Definition
The caching service is a RESTfull like JSON webservice to perform CRUD operations on a hydrological sensors repository. The standard HTTP methods like GET, POST, PUT and DELETE can be used to manipulate resources. There are two endpoint interface available. One which returns data encoded in JSON and another which return only last value based on monitoring station.

####API key
Bothe the JSON and XML API require the consumer to retreive an API key before being able to access the endpoints. An API key has to be retreived from the service in order to secure and isolate datasets. An API key can be requested by hitting the following URL:

``/svc/generate-key``

Future requests to the serivce will need to include the API key as a query string parameter with the key of "key" as in the URL examples below. Consumers will only be able to perform operation on their own datasets designated by the API key. 

#### XML Definition (default)
````
<LastValueMeasurement>
	<MonitoringPointId>MH6654</MonitoringPointId>
	<Location>
		<gml:Point srsName=\"EPSG:4326\">
            <gml:pos srsDimension=\"3\">51 -116</gml:pos></gml:Point>
         </gml:Point>
	</Location>
	<Time>2010-04-20T20:08:21</Time>
	<ObservedProperty>GageHeight</ObservedProperty>
	<Value>1.35</Value>
	<uom code=\"ft\"/>
</LastValueMeasurement>
````
#### JSON Definition (&format=json)
````
{
	"monitoringPointId": "MH6654",
	"point": [51, -116],
	"time": "2010-04-20T20:08:21",
	"observedProperty": "GageHeight",
	"value": 1.35,
	"uom": "ft"
}	
````
Property              | Description
----------------------|------------
monitoringPointId | String identifier given to the station by the station authority.
point             | Latitude and Longitude of station in [lat, lon] format. Implied CRS is WGS84 in lat/lon.
time              | Datetime of observation in YYYY-MM-DDTHH:MM:SS formt.
observedProperty | String representing name of property observed.
value             | Numeric value of property observed.
uom             | Units of measurement.

####URL Definition and Operations

Operation  |  Method | URL Example
-----------|---------|---------------------|--------
Create     | POST    |``/svc/cache?key=[YOUR_API_KEY]``
Retreive   | GET     |``/svc/cache?key=[YOUR_API_KEY]&stationId=MHB555``
Update     | PUT     |``/svc/cache?key=[YOUR_API_KEY]``
Delete     | DELETE  |``/svc/cache?key=[YOUR_API_KEY]&id=c7fa1ecf-43c4-4e24-8b98-c8e24bd8be35``

Response format will be identical to JSON/XML definition above with the exception of an additional *id* property. Which is the record's internal repositiry identifier that is used for DELETE operations. *Query filters* can be any of the defined properties and in addition if time is omited the service will return the last recorded value.

For **deleting** a record you will first need to retreive it to get its internal identifier. A second request using the DELETE HTTP method can be made passing in the id as in the above example.




