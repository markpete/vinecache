//
//  UploadVideoViewController.swift
//  VineCache
//
//  Created by Admin on 3/10/15.
//  Copyright (c) 2015 FuzzyGhost. All rights reserved.
//

import UIKit
import MobileCoreServices
import MediaPlayer

class UploadVideoViewController: UIViewController, UIImagePickerControllerDelegate, UINavigationControllerDelegate {
    
    @IBOutlet weak var imageView: UIImageView!
    var newMedia: Bool?

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    
    @IBAction func captureVideo(sender: AnyObject) {
        
        if UIImagePickerController.isSourceTypeAvailable(
            UIImagePickerControllerSourceType.Camera) {
                
                let videoPicker = UIImagePickerController()
                
                videoPicker.delegate = self
                videoPicker.sourceType =
                    UIImagePickerControllerSourceType.Camera
                videoPicker.mediaTypes = [kUTTypeMovie as NSString]
                videoPicker.allowsEditing = false
                
                self.presentViewController(videoPicker, animated: true,
                    completion: nil)
                newMedia = true
        }
    }
    
    
    func imagePickerController(picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [NSObject : AnyObject]) {
        
        let mediaType = info[UIImagePickerControllerMediaType] as NSString
        
        self.dismissViewControllerAnimated(true, completion: nil)
        
        if mediaType.isEqualToString(kUTTypeImage as NSString) {
            let image = info[UIImagePickerControllerOriginalImage]
                as UIImage
            
            imageView.image = image
            
            if (newMedia == true) {
                UIImageWriteToSavedPhotosAlbum(image, self,
                    "image:didFinishSavingWithError:contextInfo:", nil)
            } else if mediaType.isEqualToString(kUTTypeMovie as NSString) {
                // Code to support video here
            }
            
        }
    }
    
    
    func imagePickerControllerDidCancel(picker: UIImagePickerController) {
        self.dismissViewControllerAnimated(true, completion: nil)
    }

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
