//
//  ParseLibrary.swift
//  Parse
//
//  Created by user28291 on 3/11/15.
//  Copyright (c) 2015 FuzzyGhost. All rights reserved.
//

import Parse

var _PLEvent: PLEvent?
var _PLMap : PLMap?
var _PLNodes: [PLNode]?
var _PLPlayer: PLPlayer?
var _ParseDB: ParseDB?

protocol ParseDelegate {
    func EventResult(eventItem:PLEvent)
    func MapResult(mapItem: PLMap)
    func NodesResult(nodeList: [PLNode])
    func VideoRetrieved(node: PLNode)
}

class PLEvent {
    private var pfEvent : PFObject
    
    init(pfEvent: PFObject){
        self.pfEvent = pfEvent
    }

    var Name: String {
        get {
            return pfEvent["Name"] as String
        }
    }
    var DurationInMinutes: Int {
        get {
            return pfEvent["Duration"] as Int
        }
    }
    var StartTime: NSDate {
        get {
            return pfEvent["StartTime"] as NSDate
        }
    }
}

class PLMap {
    private var pfMap: PFObject
    
    init(pfMap: PFObject){
        self.pfMap = pfMap
    }
    
    var Name: String {
        get {
            return pfMap["Name"] as String
        }
    }
}

class PLNode {
    private var pfNode: PFObject
    
    init(pfNode: PFObject) {
        self.pfNode = pfNode
    }
    
    var Name: String {
        get {
            return pfNode["Name"] as String
        }
    }
    
    var Hint: String {
        get {
            return pfNode["String"] as String
        }
    }
    
    var Coordinates: PFGeoPoint {
        get {
            return pfNode["Coordinates"] as PFGeoPoint
        }
    }
    
    var Video: NSData? = nil
    var Completed: Bool = false
}

class PLPlayer {
    private var pfPerson: PFObject
    private var pfPlayer: PFObject
    private var currentNode: PLNode? = nil
    private var coordinates: PFGeoPoint? = nil
    
    init(pfPerson: PFObject, pfPlayer: PFObject){
        self.pfPerson = pfPerson
        self.pfPlayer = pfPlayer
    }
    
    var Name: String {
        get {
            return pfPerson["Name"] as String
        }
    }
    
    var Email: String {
        get {
            return pfPerson["Email"] as String
        }
    }
    
    var FacebookId: Int {
        get {
            return pfPerson["FacebookId"] as Int
        }
    }
    
    var Score: Int {
        get {
            return pfPlayer["Score"] as Int
        }
        set {
            pfPlayer["Score"] = newValue
            pfPlayer.saveEventually(nil)
        }
    }
    
    var CurrentNode: PLNode {
        get {
            return currentNode!
        }
        set {
            currentNode = newValue
            pfPlayer["CurrentNode"] = newValue.pfNode
            pfPlayer.saveEventually(nil)
        }
    }
    
    var Coordinates: PFGeoPoint {
        get {
            return coordinates!
        }
        set {
            coordinates = newValue
            pfPlayer["Coordinates"] = newValue
            pfPlayer.saveEventually(nil)
        }
    }
}

class ParseDB {
    var delegate:ParseDelegate? = nil
    
    private func _RetrieveRelation(parent: PFObject, relationKey: String, resultFunction: PFArrayResultBlock) {
        let relation: PFRelation = parent.relationForKey(relationKey)
        let query: PFQuery = relation.query();
        query.findObjectsInBackgroundWithBlock(resultFunction)
    }
    
    func GetNodes(map: PLMap) {
        _RetrieveRelation(map.pfMap, relationKey: "Nodes",
            resultFunction: { ( nodes: [AnyObject]!, error: NSError!) -> Void in
                if(error != nil) {
                    return
                }
                _PLNodes = [PLNode]()
                
                for node in nodes {
                    _PLNodes?.append(PLNode(pfNode: node as PFObject))
                }
                self.delegate?.NodesResult(_PLNodes!)
        })
    }
 
    func GetMap(event: PLEvent) {
        _RetrieveRelation(event.pfEvent, relationKey: "Map",
            resultFunction:{ ( mSet: [AnyObject]!, error: NSError!) -> Void in
                if(error != nil) {
                    return
                }
                _PLMap = PLMap(pfMap: mSet[0] as PFObject)
                self.delegate?.MapResult(_PLMap!)
            }
        )
    }

    func GetNextAvailableEvent() {
        
        var EventQuery = PFQuery(className:"Event")
        EventQuery.orderByAscending("StartTime")
        EventQuery.whereKey("StartTime", greaterThan: NSDate())
        EventQuery.getFirstObjectInBackgroundWithBlock { (event: PFObject!, error: NSError!) -> Void in
            if(error != nil) {
                return
            }
            _PLEvent = PLEvent(pfEvent: event)
            self.delegate?.EventResult(_PLEvent!)
            self.GetMap(_PLEvent!)
        }
    }
    
    func RetrieveVideo(node: PLNode) {
        var _video: PFFile = node.pfNode["Video"] as PFFile
        _video.getDataInBackgroundWithBlock { (videoData: NSData!, error: NSError!) -> Void in
            if(error == nil) {
                return
            }
            node.Video = videoData
            self.delegate?.VideoRetrieved(node)
        }
    }
    
    func CreatePlayer(Name: String, FacebookId: String, event: PLEvent){
        var person = PFObject(className: "Person")
        person["Name"] =  Name
        person["FacebookID"] = FacebookId
        
        var player = PFObject(className: "Player")
        player["Person"] = person
        player["Score"] = 0
        _PLPlayer = PLPlayer(pfPerson: person, pfPlayer: player)
        
        var relation = event.pfEvent.relationForKey("Players")
        relation.addObject(player)
        event.pfEvent.saveEventually(nil)
    }
    
    func UploadVideo(videoData: NSData, node: PLNode)
    {
        let file = PFFile(name: node.Name + ".mp4", data: videoData)
        var video = PFObject(className: "Videos")
        video["Video"] = file
        video["Node"] = node.pfNode
        var relation = node.pfNode.relationForKey("Videos")
        relation.addObject(video)
        node.pfNode.saveEventually(nil)
    }
}