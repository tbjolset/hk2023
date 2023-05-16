# Tractive API

reverse engineering the API

Login:

POST  https://graph.tractive.com/4/auth/token
  content-type: application/json;charset=UTF-8
  payload:
  {
      "platform_email": <email>,
      "platform_token": <password>,
      "grant_type": "tractive"
  }

  returns:
  {"user_id":"645b7bd76e3ab2003b8fa714","client_id":"5728aa1fc9077f7c32000186","expires_at":1684792466,"access_token":"token"}
  (lasts a week)

Get trackers:
GET https://graph.tractive.com/4/user/645b7bd76e3ab2003b8fa714/trackers
  Bearer <token>
  [{"_id":"DSJZDCTW","_type":"tracker","_version":"c3dc0653-2260517384-3121615141"},{"_id":"EYQOQBBX","_type":"tracker","_version":"54a3a9a4-2260517384-3121615141"},{"_id":"GYPQIFVS","_type":"tracker","_version":"125ffd32-2260517384-3121615141"},{"_id":"IOSMRZMD","_type":"tracker","_version":"674e5ad0-2260517384-3121615141"},{"_id":"NQSCQDCF","_type":"tracker","_version":"f099576d-2260517384-2323584881"}]

Tracker info:
GET https://graph.tractive.com/4/device_pos_report/<tracker id>
returns
  {"time":1684019696,"time_rcvd":1684019692,"sensor_used":"GPS","pos_status":["STATIONARY_FIX"],"latlong":[59.864204,10.468743],"speed":null,"pos_uncertainty":26,"_id":"DSJZDCTW","_type":"device_pos_report","_version":"94ec5c930","altitude":50,"report_id":"645be4bc4aeb067039c5ce49","nearby_user_id":null,"power_saving_zone_id":null}

Tracker status:
GET https://graph.tractive.com/4/device_hw_report/<tracker id>
returns
{
  "time": 1684019696,
  "battery_level": 0,
  "clip_mounted_state": null,
  "_id": "DSJZDCTW",
  "_type": "device_hw_report",
  "_version": "4b675d1cc",
  "report_id": "646019ecdf41c55cc1d576b4",
  "power_saving_zone_id": null,
  "hw_status": null
}


App foreground:
POST https://graph.tractive.com/4/analytics/event/app_foreground
Returns
{
  "client_id": "5728aa1fc9077f7c32000186",
  "version": "1.0.0"
}


App background:
POST https://graph.tractive.com/4/analytics/event/app_background
Returns
{
  "client_id": "5728aa1fc9077f7c32000186",
  "version": "1.0.0"
}
app foreground and background keeps being sent
