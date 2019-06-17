-- MySQL dump 10.13  Distrib 5.7.26, for Linux (x86_64)
--
-- Host: localhost    Database: mlbfd
-- ------------------------------------------------------
-- Server version	5.7.26-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `teams`
--

DROP TABLE IF EXISTS `teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `teams` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `FantasyCruncherTeam` varchar(155) NOT NULL,
  `SwishTeam` varchar(155) NOT NULL,
  `SwishTeamAbbr` varchar(45) NOT NULL,
  `SportsBookTeam` varchar(155) NOT NULL,
  `SaberSimAbbr` varchar(45) NOT NULL,
  `FanGraphs` varchar(45) DEFAULT NULL,
  `LineStar` varchar(45) DEFAULT NULL,
  `BDB` varchar(65) DEFAULT NULL,
  `Latitude` double DEFAULT NULL,
  `Longitude` double DEFAULT NULL,
  `Dome` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teams`
--

LOCK TABLES `teams` WRITE;
/*!40000 ALTER TABLE `teams` DISABLE KEYS */;
INSERT INTO `teams` VALUES (1,'ATL','braves','ATL','ATL','atl','ATL',NULL,'Atlanta Braves',33.734805,-84.389996,0),(2,'OAK','athletics','OAK','OAK','oak','OAK',NULL,'Oakland Athletics',37.751605,-122.200523,0),(3,'LAA','angels','LAA','LAA','ana','LAA',NULL,'Los Angeles Angels',33.799925,-117.883194,0),(4,'LAD','dodgers','LAD','LAD','lan','LAD','LOS','Los Angeles Dodgers',34.072724,-118.240646,0),(5,'SEA','mariners','SEA','SEA','sea','SEA',NULL,'Seattle Mariners',47.591358,-122.332283,1),(6,'ARI','diamondbacks','ARI','ARI','ari','ARI',NULL,'Arizona Diamondbacks',37.778473,-112.066721,1),(7,'HOU','astros','HOU','HOU','hou','HOU',NULL,'Houston Astros',29.756965,-95.354824,1),(8,'STL','cardinals','STL','STL','sln','STL',NULL,'St. Louis Cardinals',38.622317,-90.193891,0),(9,'TOR','bluejays','TOR','TOR','tor','TOR',NULL,'Toronto Blue Jays',43.641111,-79.389675,1),(10,'MIA','marlins','MIA','MIA','mia','MIA',NULL,'Miami Marlins',25.778655,-80.220305,1),(11,'PHI','phillies','PHI','PHI','phi','PHI',NULL,'Philadelphia Phillies',39.905547,-75.166589,0),(12,'SD','padres','SD','SD','sdn','SDP',NULL,'San Diego Padres',32.70771,-117.157097,0),(13,'SF','giants','SF','SF','sfn','SFG',NULL,'San Francisco Giants',37.778473,-122.389595,0),(14,'NYY','yankees','NYY','NYY','nya','NYY',NULL,'New York Yankees',40.829327,-73.927735,0),(15,'BOS','redsox','BOS','BOS','bos','BOS',NULL,'Boston Red Sox',42.346619,-71.096961,0),(16,'WSH','nationals','WSH','WSH','was','WSN',NULL,'Washington Nationals',38.87301,-77.007457,0),(17,'COL','rockies','COL','COL','col','COL',NULL,'Colorado Rockies',39.755891,-104.994198,0),(18,'DET','tigers','DET','DET','det','DET',NULL,'Detroit Tigers',42.339227,-83.049506,0),(19,'NYM','mets','NYM','NYM','nyn','NYM',NULL,'New York Mets',40.756337,-73.846043,0),(20,'CLE','indians','CLE','CLE','cle','CLE',NULL,'Cleveland Indians',41.496192,-81.685238,0),(21,'CHC','cubs','CHC','CHC','chn','CHC',NULL,'Chicago Cubs',41.947856,-87.655887,0),(22,'TB','rays','TB','TB','tba','TBR','TAM','Tampa Bay Rays',27.76816,-82.653465,1),(23,'TEX','rangers','TEX','TEX','tex','TEX',NULL,'Texas Rangers',32.751147,-97.082454,0),(24,'CIN','reds','CIN','CIN','cin','CIN',NULL,'Cincinnati Reds',39.097935,-84.508158,0),(25,'PIT','pirates','PIT','PIT','pit','PIT',NULL,'Pittsburgh Pirates',40.447307,-80.006841,0),(26,'BAL','orioles','BAL','BAL','bal','BAL',NULL,'Baltimore Orioles',39.283964,-76.621618,0),(27,'MIN','twins','MIN','MIN','min','MIN',NULL,'Minnesota Twins',44.981713,-93.277347,0),(28,'KC','royals','KC','KC','kca','KCR','KAN','Kansas City Royals',39.051098,-94.481115,0),(29,'CWS','whitesox','CWS','CWS','cha','CHW',NULL,'Chicago White Sox',41.829908,-87.63354,0),(30,'MIL','brewers','MIL','MIL','mil','MIL',NULL,'Milwaukee Brewers',43.027982,-87.971165,1);
/*!40000 ALTER TABLE `teams` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-06-17 12:31:04
