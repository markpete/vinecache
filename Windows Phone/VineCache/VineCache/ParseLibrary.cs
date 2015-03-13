using Parse;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using System.Linq;

namespace VineCache
{
	public class PLEvent
	{
		internal ParseObject pfEvent;

		public PLEvent(ParseObject parseObject)
		{
			pfEvent = parseObject;
		}

		public string Name
		{
			get
			{
				return pfEvent["Name"] as string;
			}
		}

		public int? DurationInMinutes
		{
			get
			{
				return pfEvent["Duration"] as int?;
			}
		}

		public DateTime? StartTime
		{
			get
			{
				return pfEvent["StartTime"] as DateTime?;
			}
		}
	}

	public class PLMap
	{
		internal ParseObject pfMAp;

		public PLMap(ParseObject parseObject)
		{
			pfMAp = parseObject;
		}

		public string Name
		{
			get
			{
				return pfMAp["Name"] as string;
			}
		}
	}

	public class PLNode
	{
		internal ParseObject pfNode;

		public object Video = null;
		public bool Completed = false;

		public PLNode(ParseObject parseObject)
		{
			pfNode = parseObject;
		}

		public string Name
		{
			get
			{
				return pfNode["Name"] as string;
			}
		}

		public string Hint
		{
			get
			{
				return pfNode["Hint"] as string;
			}
		}

		public ParseGeoPoint? Coordinates
		{
			get
			{
				return pfNode["Coordinates"] as ParseGeoPoint?;
			}
		}
	}

	public class PLPlayer
	{
		public static PLEvent tempEvent;
		internal ParseObject pfPerson;
		internal ParseObject pfPlayer;
		private PLNode currentNode = null;
		private ParseGeoPoint? coordinates = null;

		public PLPlayer(ParseObject personParseObject, ParseObject playerParseObject)
		{
			pfPerson = personParseObject;
			pfPlayer = playerParseObject;
		}

		public string Name
		{
			get
			{
				return pfPerson["Name"] as string;
			}
		}

		public string Email
		{
			get
			{
				return pfPerson["Email"] as string;
			}
		}
		public string FacebookId
		{
			get
			{
				return pfPerson["FacebookId"] as string;
			}
		}

		public int? Score
		{
			get
			{
				return pfPerson["Score"] as int?;
			}
			set
			{
				pfPlayer["Score"] = value;
				pfPlayer.SaveAsync();
			}
		}
		public PLNode CurrentNode
		{
			get
			{
				return currentNode;
			}
			set
			{
				currentNode = value;
				pfPlayer["CurrentNode"] = value.pfNode;
				pfPlayer.SaveAsync();
			}
		}

		public ParseGeoPoint? Coordinates
		{
			get
			{
				return coordinates;
			}
			set
			{
				coordinates = value;
				pfPlayer["Coordinates"] = value;
				pfPlayer.SaveAsync();
			}
		}
	}

	public interface ParseDelegate
	{
		void EventResult(PLEvent eventItem);
		void MapResult(PLMap mapItem);
		void NodeResult(List<PLNode> nodeList);
		void VideoRetrieved(PLNode node);
	}

	public class ParseDB
	{
		public ParseDelegate parseDelegate = null;

		public static PLEvent _PLEvent;
		public static PLMap _PLMap;
		public static List<PLNode> _PLNodes;
		public static PLPlayer _PLPlayer;

		private void RetrieveRelation(ParseObject parent, string relationKey, Action<Task<IEnumerable<ParseObject>>> resultFunction)
		{
			ParseRelation<ParseObject> relation = parent.GetRelation<ParseObject>(relationKey);
			var query = relation.Query;
			query.FindAsync().ContinueWith(resultFunction);
		}

		public void GetNodes(PLMap map)
		{
			RetrieveRelation(map.pfMAp, "Nodes", (Task<IEnumerable<ParseObject>> task) => {
				if (task.IsFaulted)
				{
					return;
				}
				_PLNodes = new List<PLNode>();

				foreach (ParseObject node in task.Result)
				{
					_PLNodes?.Add(new PLNode(node));
				}
				this.parseDelegate?.NodeResult(_PLNodes);
			});
        }

		public void GetMap(PLEvent plEvent)
		{
			RetrieveRelation(plEvent.pfEvent, "Map", (Task<IEnumerable<ParseObject>> task) =>
			{
				if (task.IsFaulted)
				{
					return;
				}

				try
				{
					ParseObject[] objects = task.Result.ToArray();
					PLMap map = new PLMap(objects[0]);
					
					ParseDB._PLMap = map;

					this.parseDelegate?.MapResult(_PLMap);
				}
				catch (Exception)
				{ }
			});
		}

		public void GetNextAvailableEvent()
		{
			ParseQuery<ParseObject> query = new ParseQuery<ParseObject>("Event").OrderBy("StartTime").WhereGreaterThan("StartTime", DateTime.Now);
			query.FirstOrDefaultAsync().ContinueWith((Task<ParseObject> task) => {
				if (task.IsFaulted)
				{
					return;
				}
				_PLEvent = new PLEvent(task.Result);
				this.parseDelegate?.EventResult(_PLEvent);
				this.GetMap(_PLEvent);
			});
		}

		public void RetrieveVideo(PLNode node)
		{
			var video = node.pfNode["Video"] as ParseFile;
			Uri url = video.Url;
			HttpClient httpClient = new HttpClient();
			httpClient.GetByteArrayAsync(video.Url).ContinueWith((Task<byte[]> task, object state) => {
				if (task.IsFaulted)
				{
					return;
				}
				((PLNode)state).Video = task.Result;
				this.parseDelegate?.VideoRetrieved(node);
			}, node);
		}

		public void CreatePlayer(string name, string email, string facebookID, PLEvent plEvent)
		{
			PLPlayer.tempEvent = plEvent;
			var person = new ParseObject("Person");
			person["Name"] = name;
			person["Email"] = email;
			person["FacebookId"] = facebookID;

			var player = new ParseObject("Player");
			//player["Person"] = person;
			player["Score"] = 0;
			_PLPlayer = new PLPlayer(person, player);

			//Is player already registered in event?
			ParseQuery<ParseObject> query = new ParseQuery<ParseObject>("Players");
			query.FindAsync().ContinueWith((Task<IEnumerable<ParseObject>> task, object state) =>
			{
				ParseObject currentPerson = (state as PLPlayer).pfPerson;
				bool playerExists = false;
				foreach (ParseObject existingPlayer in task.Result)
				{
					ParseObject existingPerson = existingPlayer["Person"] as ParseObject;
					if (existingPerson["FacebookID"] == currentPerson["FacebookID"])
					{
						playerExists = true;
						break;
					}
				}

				if (!playerExists)
				{
					currentPerson.SaveAsync().ContinueWith((Task t, object player1) => {
						((player1 as PLPlayer).pfPlayer as ParseObject).SaveAsync().ContinueWith((Task t1, object myplayer) => {

							var playerpersonrelation = (myplayer as PLPlayer).pfPlayer.GetRelation<ParseObject>("Person");
							playerpersonrelation.Add((player1 as PLPlayer).pfPerson as ParseObject);
							((player1 as PLPlayer).pfPlayer as ParseObject).SaveAsync();

							var relation = PLPlayer.tempEvent.pfEvent.GetRelation<ParseObject>("Players");
							relation.Add((player1 as PLPlayer).pfPlayer as ParseObject);
							PLPlayer.tempEvent.pfEvent.SaveAsync();
						}, player1);
					}, state);
				}
			}, _PLPlayer);
		}

		public void UploadVideo(byte[] videoData, PLNode node)
		{
			var file = new ParseFile(node.Name + ".mp4", videoData);
			var video = new ParseObject("Videos");
			video["Video"] = file;
			video["Node"] = node.pfNode;
			var relation = _PLPlayer.pfPlayer.GetRelation<ParseObject>("Videos");
			relation.Add(video);
			node.pfNode.SaveAsync();
		}
	}
}