using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.Media.Capture;
using Windows.Media.MediaProperties;
using Windows.Phone.UI.Input;
using Windows.Storage;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

// The Blank Page item template is documented at http://go.microsoft.com/fwlink/?LinkID=390556

namespace VineCache
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class UploadVideoPage : Page
    {
        private MediaCapture mediaCapture;
        private const string VideoFileName = "vinecache.mp4";

        public UploadVideoPage()
        {
            this.InitializeComponent();
        }

        private async void InitVideoCapture()
        {
            this.mediaCapture = new MediaCapture();
            await this.mediaCapture.InitializeAsync();
            this.mediaCapture.SetPreviewRotation(VideoRotation.Clockwise90Degrees);
            this.mediaCapture.SetRecordRotation(VideoRotation.Clockwise90Degrees);
            this.videoPreviewElement.Source = mediaCapture;
            await this.mediaCapture.StartPreviewAsync();
        }

        private async void StartRecordingVideo()
        {
            if (this.mediaCapture != null)
            {
                StorageFile videoStorageFile = await KnownFolders.VideosLibrary.CreateFileAsync(VideoFileName, CreationCollisionOption.ReplaceExisting);
                MediaEncodingProfile encodingProfile = MediaEncodingProfile.CreateMp4(VideoEncodingQuality.HD720p);
                await this.mediaCapture.StartRecordToStorageFileAsync(encodingProfile, videoStorageFile);

                await Task.Delay(6000);
                StopRecordingVideo();
            }
        }

        private async void StopRecordingVideo()
        {
            await this.mediaCapture.StopRecordAsync();
        }


        /// <summary>
        /// Invoked when this page is about to be displayed in a Frame.
        /// </summary>
        /// <param name="e">Event data that describes how this page was reached.
        /// This parameter is typically used to configure the page.</param>
        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
            this.InitVideoCapture();
        }
        
        private void StartRecordingButton_Click(object sender, RoutedEventArgs e)
        {
            StartRecordingVideo();
        }

        private void UploadRecordingButton_Click(object sender, RoutedEventArgs e)
        {
            StopRecordingVideo();
        }

        private void videoMediaElement_Tapped(object sender, RoutedEventArgs e)
        {

        }
    }
}
