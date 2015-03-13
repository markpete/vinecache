using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;
using Windows.Devices.Geolocation;
using Windows.Storage;

// The Blank Page item template is documented at http://go.microsoft.com/fwlink/?LinkID=390556

namespace VineCache
{
    /// <summary>
    /// An empty page that can be used on its own or navigated to within a Frame.
    /// </summary>
    public sealed partial class DisplayVideoPage : Page
    {
        private Geopoint startingPoint;
        private double m_startingDistance;

        public DisplayVideoPage()
        {
            this.InitializeComponent();
            App.GPS.PositionChanged += gps_PositionChanged;
        }

        /// <summary>
        /// Executes when the GPS Device detects that it's position has changed
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="args"></param>
        private void gps_PositionChanged(Geolocator sender, PositionChangedEventArgs args)
        {
            if (startingPoint != null)
            {
                UpdateProgress(args.Position.Coordinate.Point);
            }
        }

        /// <summary>
        /// Update the progress bar
        /// </summary>
        /// <param name="point">The current location</param>
        private async void UpdateProgress(Geopoint point)
        {
            await Dispatcher.RunAsync(Windows.UI.Core.CoreDispatcherPriority.Normal,() =>
            {
                double currentDistance = GPSHelper.CalculateDistance(point, GetTargetCoordinates());
                this.distanceToObjectProgressBar.Value = GPSHelper.CalculateProgress(currentDistance, m_startingDistance);
                if (GPSHelper.IsTargetClose(currentDistance))
                {
                    NavigateToUploadVideoPage();
                }
            });
        }

        /// <summary>
        /// Invoked when this page is about to be displayed in a Frame.
        /// </summary>
        /// <param name="e">Event data that describes how this page was reached.
        /// This parameter is typically used to configure the page.</param>
        protected override void OnNavigatedTo(NavigationEventArgs e)
        {
        }

        private async void videoMediaElement_Tapped(object sender, TappedRoutedEventArgs e)
        {
			SetVideoTarget();
			//this.NavigateToUploadVideoPage();
			videoMediaElement.Play();
            distanceToObjectProgressBar.Value = 50;
            if (this.startingPoint == null)
            {
                Geoposition position = await App.GPS.GetGeopositionAsync();
                if (position != null)
                {
                    startingPoint = position.Coordinate.Point;
                    m_startingDistance = GPSHelper.CalculateDistance(startingPoint, GetTargetCoordinates());
                }
            }
        }

		public void SetVideoTarget()
		{
			this.videoMediaElement.Source = new Uri(KnownFolders.VideosLibrary.Path + "/vinecachetargetvideo.mp4");
		}

        private void NavigateToUploadVideoPage()
        {
            Frame rootFrame = Window.Current.Content as Frame;
            rootFrame.Navigate(typeof(UploadVideoPage));
        }

        private Point GetTargetCoordinates()
        {
            //TODO: Get GPS Point from Node
            return new Point(47.6455, -122.1286);
        }
    }
}
