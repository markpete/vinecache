//
//  DisplayVideoViewController.swift
//  VineCache
//
//  Created by Admin on 3/10/15.
//  Copyright (c) 2015 FuzzyGhost. All rights reserved.
//

import UIKit
import MediaPlayer

class DisplayVideoViewController: UIViewController {
    
    var videoPlayer : MPMoviePlayerController?

    override func viewDidLoad() {
        super.viewDidLoad()
        playVideo()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    
    func playVideo() {
        let path = NSBundle.mainBundle().pathForResource("Fountain", ofType:"mp4")
        let url = NSURL.fileURLWithPath(path!)
        videoPlayer = MPMoviePlayerController(contentURL: url)
        if let player = videoPlayer {
            player.view.frame = self.view.frame
            player.controlStyle = MPMovieControlStyle.Embedded
            player.shouldAutoplay = false;
            self.view.addSubview(player.view)
            player.prepareToPlay()
        }
    }
}
