//
//  MainGameViewController.swift
//  VineCache
//
//  Created by Admin on 3/11/15.
//  Copyright (c) 2015 FuzzyGhost. All rights reserved.
//

import UIKit
import CoreLocation
import MediaPlayer

class MainGameViewController: UIViewController, TimerDelegate{

    @IBOutlet var videoPlayer: MPMoviePlayerController!

    override func viewDidLoad() {
        super.viewDidLoad()
        
        /* load a count down view */
        var gamelaunchTimerView:TimerView = TimerView.loadingCountDownTimerViewInView(self.view)
        gamelaunchTimerView.delegate = self
        gamelaunchTimerView.startTimer()
    }

//    @IBAction func GetVideoButtonClick(sender: UIButton) {
//        getNextVideo()
//    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    @IBAction func RecordButtonClick(sender: UIButton) {
        self.performSegueWithIdentifier("segueIdentifier", sender: self)
    }
    
    func eventStarted() {
        getNextVideo()
    }
    
    func getNextVideo() {
        let path = NSBundle.mainBundle().pathForResource("Fountain", ofType:"mp4")
        let url = NSURL.fileURLWithPath(path!)
        videoPlayer = MPMoviePlayerController(contentURL: url)
        videoPlayer.view.center = self.view.center
        videoPlayer.view.frame = CGRectMake(20, 100, 280, 250)
        videoPlayer.controlStyle = MPMovieControlStyle.Embedded
        videoPlayer.shouldAutoplay = false
        self.view.addSubview(self.videoPlayer.view)
        videoPlayer.play()
    }
}
