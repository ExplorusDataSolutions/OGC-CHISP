class Subscription < ActiveRecord::Base
  attr_accessible :email, :frequency, :lat, :lng, :station_id, :sw_flow_threshold, :sw_level_threshold, :poi_type, :status
  def as_json(options = nil)
    if poi_type == 'P'
      {
        "email" => email,
        "poi_id" => id,
        "poi_type" => poi_type,
        "lat" => lat,
        "lng" => lng,
        "status" => status,
        "sw_flow_threshold" => sw_flow_threshold,
        "sw_level_threshold" => sw_level_threshold,
        "frequency" => frequency
      }
    elsif poi_type == 'S'
      {
        "email" => email,
        "poi_id" => id,
        "poi_type" => poi_type,
        "station_id" => station_id,
        "status" => status,
        "sw_flow_threshold" => sw_flow_threshold,
        "sw_level_threshold" => sw_level_threshold,
        "frequency" => frequency
      }
    end
  end

  def to_xml
    <<-XML
      <Subscription>
        <Email>#{email}</Email>
        <POI_ID>#{id}</POI_ID>
        <Frequency>#{frequency}</Frequency>
        <StationID>#{station_id}</StationID>
        <SW_Flow_Threshold>#{sw_flow_threshold}</SW_Flow_Threshold>
        <SW_Level_Threshold>#{sw_level_threshold}</SW_Level_Threshold>
        <Location>
          <gml:Point srsName="EPSG:4326">
            <gml:pos>#{lat} #{lng}</gml:pos>
          </gml:Point>
        </Location>
      </Subscription>
    XML
  end
end
