using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Windows.Devices.Geolocation;
using Windows.Foundation;

namespace VineCache
{
    public class GPSHelper
    {
        /// <summary>
        /// Calculates the distance (in meters) between GPS coordinates
        /// </summary>
        /// <param name="startingPoint"></param>
        /// <param name="targetPoint"></param>
        /// <returns></returns>
        public static double CalculateDistance(Geopoint startingPoint, Point targetPoint)
        {
            double i = (Math.Cos(DegreeToRadian(targetPoint.X)) * Math.Cos(DegreeToRadian(startingPoint.Position.Latitude))
                        * Math.Cos(DegreeToRadian(targetPoint.Y)) * Math.Cos(DegreeToRadian(startingPoint.Position.Longitude))
                        + Math.Cos(DegreeToRadian(targetPoint.X)) * Math.Sin(DegreeToRadian(targetPoint.Y))
                        * Math.Cos(DegreeToRadian(startingPoint.Position.Latitude)) * Math.Sin(DegreeToRadian(startingPoint.Position.Longitude))
                        + Math.Sin(DegreeToRadian(targetPoint.X)) * Math.Sin(DegreeToRadian(startingPoint.Position.Latitude)));

            double meters = (6371000 * (Math.Acos(i)));
            return meters;
        }

        /// <summary>
        /// Calcuate the progess 0-100 (100complete) of traveling to the target location
        /// </summary>
        /// <param name="currentDistance"></param>
        /// <param name="startingDistance"></param>
        /// <returns></returns>
        public static double CalculateProgress(double currentDistance, double startingDistance)
        {
            double zeroDistance = startingDistance * 2;
            double progressDistance = zeroDistance - currentDistance;
            double progress = (progressDistance / zeroDistance) * 100;
            return progress;
        }

        /// <summary>
        /// Converte Degrees to radians
        /// </summary>
        /// <param name="angle"></param>
        /// <returns></returns>
        public static double DegreeToRadian(double angle)
        {
            return Math.PI * angle / 180.0;
        }

        /// <summary>
        /// Is the target within 25 meters?
        /// </summary>
        /// <param name="distance"></param>
        /// <returns></returns>
        public static bool IsTargetClose(double distance)
        {
            return distance < 25;
        }
    }
}
