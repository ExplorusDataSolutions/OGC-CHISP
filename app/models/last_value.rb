class LastValue < ActiveRecord::Base
  attr_accessible :monitoringPointId, :observedProperty, :point, :time, :uom, :value, :api_key
  def to_json
    ActiveSupport::JSON.encode(self)
  end

  def to_xml
    <<-XML
      <LastValueMeasurement xmlns:gml="http://www.opengis.net/gml">
        <MonitoringPointId>#{monitoringPointId}</MonitoringPointId>
        <Location>
          <gml:Point srsName="EPSG:4326">
            <gml:pos srsDimension="3">#{point}</gml:pos>
          </gml:Point>
        </Location>
        <Timestamp>#{time}</Timestamp>
        <ObservedProperty>#{observedProperty}</ObservedProperty>
        <Value uom="#{uom}">#{value}</Value>
      </LastValueMeasurement>
    XML
  end
end
