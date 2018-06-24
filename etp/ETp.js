// compute ETp using Neural Network

var math = require('mathjs');
var moment = require('moment');

var admin = require("firebase-admin");

function snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function(childSnapshot) {
        var item = childSnapshot.val();
        item.id = childSnapshot.key;

        returnArr.push(item);
    });

    return returnArr;
};

// Get a reference to the database service
var db = admin.database();

var iw = math.matrix([
  [1.3993, 2.6755, 0.33961],
  [1.389, 0.26692, 0.47701],
  [0.32262, -1.981, -2.6355],
  [-0.16356, 1.4173, 1.5602],
  [-0.036845, 0.63804, -2.4789],
  [0.61226, 3.2486, 0.59816],
  [1.0333, 1.3391, 2.0899],
  [0.58596, -1.6811, -1.5383],
  [-1.463, 2.241, -0.92349],
  [-0.42268, 0.79165, 2.5418],
  [-1.1906, -2.323, 0.56014],
  [-1.1095, -1.1904, -1.402],
  [-0.94914, -1.6981, 1.134],
  [-1.4727, 1.2531, -0.25905],
  [-1.4455, 0.93214, -2.7018]
]);

var lw1 = math.matrix([
  [0.37596, 0.4721, 0.1138, -0.41975, -0.091968, -0.30411, -0.74709, 0.019748, 0.43862, 0.21732, -0.1974, 0.94791, 0.5887, 0.090734, 0.32761],
  [-1.1631, 1.0973, 0.20342, 0.31228, -0.24975, 0.3944, 0.48992, -0.25558, 0.51101, -0.3463, 0.056507, 0.9869, 0.71951, 1.1342, -0.11454],
  [-0.59313, -0.60499, 0.42656, -0.23219, -0.21068, 0.77032, -0.27506, -0.52354, 0.64233, -0.1009, -0.28191, -1.3504, 0.90498, -0.048677, 0.79026],
  [-0.08277, 1.44, 0.18266, 1.0812, 0.27378, 0.4319, 0.23021, 0.68414, -0.08523, 0.054161, 0.80214, 0.20656, -0.32227, 0.37844, 0.20627],
  [-1.0774, -0.61334, -0.73487, -0.28478, 1.0191, -0.22138, -0.73171, -0.28474, -0.34535, 0.62541, -0.36809, 1.2592, 0.82127, -0.009812, -0.054254],
  [-0.84266, 0.5717, -0.97247, -0.087159, 0.33116, 0.064052, 0.03391, -0.29007, 0.46302, -1.1375, 0.82586, -0.39826, 0.16527, 0.22807, 0.38195],
  [0.44168, 0.57781, 0.034197, -0.748, 0.11892, 0.16351, 0.42354, -0.28662, -0.26196, -0.10248, 0.85427, -0.95801, -0.9252, -0.69066, 0.24729],
  [-0.71803, 0.30294, 0.076059, -1.0195, 0.27025, 0.81747, 0.056543, 0.7067, -0.34217, -0.14514, -0.64456, -0.40566, 0.97792, -0.45515, 0.10869],
  [-0.14503, -0.11104, -0.19103, -1.9016, -0.71862, -0.74646, 0.060762, 0.11829, -0.64198, -1.0602, 0.82768, -1.5281, 0.7939, 0.90642, 0.36591],
  [-1.1602, 0.55613, 0.55064, 0.39422, 0.27466, 0.11219, 0.082657, -1.066, 0.45729, 0.21349, -0.65992, -0.029698, -0.15071, -0.10348, 0.34604],
  [-0.88439, 0.93222, -0.27268, 0.75309, 0.82531, 0.32583, -0.12306, -0.37259, -0.19254, -0.21685, -1.0945, 0.31233, 0.83378, -0.89195, 0.84415],
  [0.41855, -0.6136, -0.62079, 0.59303, -0.60958, 0.062238, -0.2066, -0.18143, 0.077936, 0.68933, -1.0756, 0.54917, 0.63022, -0.2394, -0.22939],
  [0.66357, -0.29729, 0.52122, 0.26289, -0.053064, 0.28174, 0.74691, 0.64433, 0.10488, -0.68213, -0.53041, -0.98897, -0.43222, -1.1328, 0.1872],
  [-0.42062, 0.8704, 0.17308, -0.54679, 0.45603, 0.85255, -0.39394, -0.79087, 0.37149, -0.30914, 0.42699, -0.4614, 1.2606, -0.19173, 0.28541],
  [0.21655, 0.46685, 0.3814, -0.20287, -0.65877, -0.27152, 0.51924, -1.2188, 0.099208, 0.033332, 0.64179, -0.6249, -1.1168, -0.078329, 0.7107]
]);

var lw2 = math.matrix([
  [0.13741, 0.59882, -0.23679, 1.3075, 0.94737, -0.47618, -0.023854, -0.68865, 0.19933, -0.51375, -0.60764, 0.30309, -0.019793, 0.38687, -0.14405],
  [0.076684, 0.55087, -0.2359, 0.5455, -0.17747, -0.53209, -0.50195, 0.62151, 0.85924, -0.15895, -0.60057, 0.58453, 0.35756, -0.5843, 0.65933],
  [0.20522, -0.48261, -0.084119, 0.13142, -0.89191, 0.47839, 0.72246, -0.782, 0.4434, -0.095685, 0.55488, 0.47627, -0.59689, -0.44329, -1.722],
  [-0.11659, -0.46753, 1.6093, 0.049151, -0.69477, 0.75154, -0.52211, 0.61348, -0.80557, 0.63141, 0.79739, 0.45441, 0.88529, -0.42896, -0.34],
  [0.34999, -0.49043, -0.12585, -0.26987, -0.13183, -0.10949, 0.13472, 0.17052, 0.35156, 0.077545, 0.73782, -0.93105, -0.042422, 0.66625, -0.48424],
  [0.26062, 0.65252, -0.59297, 0.20285, -0.3117, 0.68083, -0.38497, 0.1941, 0.54899, 0.15378, -0.32339, 0.75756, 0.56665, -0.81699, 0.38105],
  [0.2117, 0.34173, 0.54454, -1.0192, -0.87112, -0.92424, -0.53138, -0.34427, -0.52582, -0.54309, 0.50521, -0.88807, -0.20913, 0.4381, 0.60278],
  [-0.18684, -0.40584, -0.99645, -0., -0.33841, 0.57265, -0.61432, -0.079443, -0.99862, 0.90374, -0.30693, -0.69134, -0.47551, -0.47243, 0.40535],
  [0.32926, 0.16944, 0.20228, 0.16021, 0.05517, 0.67373, -0.83464, 0.24824, 0.93484, -0.034042, -0.64662, 0.93311, 0.26962, -0.55707, 0.11306],
  [-0.50463, 0.036628, 0.15689, -0.27157, 1.0628, -0.16074, 0.78898, 0.56283, 0.065189, 0.34186, 0.58843, -0.35055, 0.59214, 0.60049, 1.2078],
  [0.019568, 0.27803, -0.46292, -0.099799, -0.36431, 0.52111, -0.10977, 0.39075, -0.029661, 0.42734, -0.67814, 0.38993, 0.58264, -0.40667, 0.060159],
  [0.037527, -0.62309, -0.30042, 0.021017, -0.074473, 0.34596, -0.13892, 0.60155, 0.44064, 0.87822, -0.41047, 0.17952, -0.29146, -0.50332, 0.26531],
  [-0.29598, 0.86346, -0.93312, 0.35882, -0.30762, -0.31269, -0.025333, 0.24964, 0.020314, 0.45007, 0.43979, 0.80562, -0.42056, 0.77657, -0.36312],
  [-0.19083, 0.10788, 0.66119, 0.06987, 0.39679, 0.12157, 0.30587, -0.67193, -0.51985, -0.57139, -0.03858, 0.60517, 0.4408, 0.20806, -0.14087],
  [0.6568, -0.075942, -0.056323, -0.55089, -0.54704, 0.13956, -0.84508, 0.50128, 0.020664, 0.4199, -0.65651, 0.43938, 0.59447, -0.95747, -0.33031]
]);

var lw3 = math.matrix([
  [0.59909,-0.13488,0.039766,0.45555,0.17968,1.4665,-0.84424,-0.63318,-1.089,0.49058,0.51023,0.85285,0.39044,0.47806,-0.15919],
  [-0.079901,0.41627,-0.42561,-0.62711,-1.3129,-0.97605,0.65405,0.74947,-0.39468,-0.17221,-0.3052,-0.33534,0.58236,0.17403,0.4305],
  [-0.20774,-0.77002,0.36356,0.02132,0.52408,0.35562,1.0686,0.16407,-0.43089,0.30785,-0.40335,0.75659,-0.82545,-0.048205,0.78985],
  [-0.26813,0.22927,-0.36854,-0.34999,-0.22728,0.28072,0.67294,0.099855,-0.17794,-0.13425,-1.2635,-1.2279,0.020895,-1.4042,0.86721],
  [-0.38742,-0.041112,-0.66051,-0.48196,0.010362,0.59089,-0.10039,-0.23917,-0.068478,0.078153,0.70972,-0.975,0.37155,-0.23779,-0.83409],
  [-0.65926,0.34008,1.4464,0.45735,-0.065829,0.074214,0.61386,-0.15884,0.65649,0.42375,0.61801,0.83425,-0.10446,0.52228,-0.45817],
  [-0.34121,0.006074,-0.25357,-0.236,0.45753,0.91191,0.74534,-0.68381,-0.61127,-1.202,-0.5788,-0.38141,-0.38338,0.49994,-0.31935],
  [0.15419,-0.60948,-0.0080493,-0.59698,0.99834,0.22146,0.26499,-0.3233,-0.75371,-1.0246,0.75162,0.0050493,0.27896,-0.071539,-0.64503],
  [-1.0724,-1.1138,0.20373,-0.098966,0.19457,0.911,-0.73658,-0.13474,-0.26908,-0.48889,0.31966,-0.31561,0.042437,-0.41314,-1.2963],
  [0.13192,-0.8119,0.2449,-1.0908,0.012649,0.42186,0.44324,0.78626,0.011356,0.37529,-0.019459,-0.58422,0.45297,0.24563,0.47775],
  [-0.92119,0.43751,0.53324,-0.69,0.83037,-0.38621,-0.62003,-0.32921,-0.19088,-0.23776,-0.042406,-0.90448,-0.02624,-0.44171,-0.89272],
  [-0.28939,-0.095199,-0.73735,-0.2022,1.1589,0.4335,0.07309,0.23905,0.37997,-0.047704,-0.73818,-0.056959,-0.0075534,0.63253,-0.16218],
  [-0.074649,-0.14543,-0.42491,0.40639,-0.94068,-0.087402,-0.55872,-0.32341,-0.0078636,-0.87541,-0.94777,0.5482,0.4547,-0.23797,-0.64675],
  [1.326,0.69431,0.4322,0.21433,0.057168,0.18319,0.15961,0.80647,0.27441,0.37742,0.18146,1.5872,-0.25001,0.096603,0.095676],
  [0.45971,0.73055,1.3086,-0.31798,-0.25925,-0.74791,0.41752,-0.20811,-0.085891,0.13472,0.44439,0.40625,-0.23134,0.49581,-0.51785]
]);

var lw4 = math.matrix([
  [-0.024415,0.05768,0.91315,0.39486,0.33391,0.49212,0.9039,0.45981,0.34831,0.89925,0.46663,0.18732,-0.13231,-0.46103,-0.027602],
  [0.88691,0.054984,0.68398,0.4594,-0.45047,0.86583,-0.059012,0.029538,-0.81288,-0.29459,0.40674,0.34769,0.71823,0.70433,-0.23943],
  [-0.17239,0.65246,-0.83188,0.28897,0.78912,0.47675,0.10607,-0.80297,0.31461,0.25003,-0.91809,-0.11786,0.14165,-0.20675,0.54593],
  [0.31943,0.66919,0.55205,-0.30617,-0.69752,1.1513,-0.15159,-0.63821,-0.47301,-0.64838,0.58233,0.21043,-0.062428,-1.3869,-0.69871],
  [-0.36907,-0.71213,-0.25241,0.97758,0.58259,0.45062,-0.30614,0.95735,-0.59617,0.82679,-0.4328,1.2157,-0.47166,1.399,0.52905],
  [-0.0062047,-0.22967,0.24463,0.10105,-0.83034,-0.25542,0.88204,-0.026772,0.64758,0.70912,-0.20025,1.0366,0.79675,0.45116,-0.32478],
  [-0.21799,-0.50497,-0.56085,-1.0876,-0.63695,-0.83372,0.285,-0.86444,0.6585,0.14762,0.90321,-1.4432,-0.69963,-0.57327,-0.15947],
  [-0.14585,0.15912,0.094885,1.0817,0.14214,-0.23912,1.3423,-0.10027,0.34369,0.26421,-0.14776,-0.65872,0.97314,0.15805,-0.82447],
  [0.32962,-0.024268,-0.30377,0.16262,-0.36762,-0.27434,1.066,0.69202,-0.67736,-0.14306,-0.26056,-0.50857,-1.0595,-0.29595,-0.42186],
  [0.90056,-0.19177,-0.30654,1.0875,-0.60919,-0.87619,1.057,0.23995,-0.77562,-0.77756,-0.11784,-0.41332,-0.50736,-0.14246,-0.19328],
  [0.67697,-0.2005,-0.38515,-0.052957,-0.89258,0.34757,0.65477,0.34166,1.0644,0.40722,-0.76085,1.3037,-0.37711,0.076794,-0.7316],
  [-0.444,0.46214,-0.14775,1.1095,-0.29335,-0.078122,-0.39664,0.075268,0.79203,-0.94083,-0.32711,-1.1247,-1.052,-0.36922,0.39501],
  [-0.88317,-0.11929,0.48908,-0.75411,-0.49531,0.33928,-0.42314,0.19355,0.55668,-0.76119,-1.0237,-0.47715,-0.40629,-0.002319,0.18979],
  [-0.094244,0.43876,0.44985,1.2752,-0.71487,-0.80102,0.60546,0.2733,0.31222,-0.22219,0.38521,0.81112,-0.68145,0.50669,-0.35828],
  [-0.58486,-0.11783,0.74589,0.97901,-0.29753,0.35806,-0.2673,0.81286,0.49366,-0.63382,-0.79285,0.88305,-0.16365,0.58061,-0.16694]
]);

var lw5 = math.matrix([
  [0.030307,-0.6097,-0.71073,0.27195,-0.085601,-0.15617,0.73967,-0.46306,-0.46136,0.63683,0.03236,0.72215,1.0519,0.5405,0.43102],
  [-0.47801,-0.071199,0.28212,-0.07947,-0.32474,-0.95589,0.48189,-0.6293,-0.14357,0.27158,-0.3,1.194,0.40775,-0.16892,-0.37762],
  [-0.42069,-0.41824,0.54099,0.33257,0.87006,-0.47856,0.039106,-0.59219,0.3302,0.038943,0.90994,0.83695,0.96532,0.10616,0.96425],
  [-0.20417,-0.43206,-0.64792,0.54715,0.03437,0.061608,0.87031,0.92581,-0.34621,0.090856,-1.1407,-0.59982,-0.94328,0.23954,1.2427],
  [0.59882,0.21132,0.68933,-0.32358,0.74265,-0.89461,0.6462,-0.58543,1.2647,-0.12223,0.59984,-0.079223,0.28554,-0.34742,0.30886],
  [-0.67149,0.038626,1.1639,0.27259,-0.059221,0.20969,0.23736,-0.14037,-1.4043,0.39659,0.71864,0.66443,0.40996,1.0963,-0.82139],
  [0.70354,-0.50526,-0.34829,-1.0454,0.36364,-0.065792,-0.14867,-0.69,0.57362,0.076331,-0.48232,0.56627,-0.074511,-1.0841,1.1941],
  [-0.035805,-0.28764,-0.70709,-0.10235,0.17835,-1.4927,0.57714,0.36483,0.93501,-0.25056,0.7299,0.13298,0.41,1.1002,-0.35092],
  [0.58863,0.035524,0.72987,0.54716,-0.23681,-1.148,-1.4847,-0.12828,0.35723,-0.12265,0.09211,-0.15364,0.84562,0.54165,-0.32593],
  [0.17037,-0.78698,0.54789,0.18209,0.54962,1.2577,0.17409,0.62038,0.30937,0.34123,-0.17946,-0.052728,-0.31166,-0.14044,-1.2015],
  [0.60883,0.8074,0.31993,-0.30999,-0.60691,0.22441,0.047265,-0.13721,-0.25055,0.65619,-0.72873,1.1597,-0.19649,-0.17769,-0.93579],
  [-0.47622,0.37454,0.23478,-0.43099,0.12193,0.44358,-0.45688,0.63833,0.90122,0.7543,0.70647,-0.30251,-0.015588,-0.65727,-1.0316],
  [-0.3542,0.15307,-0.60876,-0.91875,1.384,0.94745,-0.54679,0.5384,0.016914,-1.1256,0.57644,-0.61836,-0.8212,-0.71905,-0.54374],
  [0.9002,0.66978,-0.11378,-0.28758,-0.087982,-0.68698,-0.87765,0.28719,0.21326,-0.1245,-0.62731,0.56903,0.38367,-0.1795,-0.27469],
  [-0.82718,-1.7283,-0.36576,0.066933,0.040317,0.78937,-0.7856,0.050934,-0.15925,-0.12538,0.99949,-0.28029,0.54236,0.65524,0.83421]
]);

var lw6 = math.matrix([
  [0.64082,0.0093524,-0.06457,-0.4491,0.0087192,-0.42719,-0.59943,-0.15157,0.67126,-0.025821,-0.49931,-0.33734,0.69255,0.21959,0.53763],
  [-0.76982,0.50421,-0.18446,-0.29169,0.16217,0.37888,-0.4955,0.77539,-0.2713,0.79257,-0.07949,0.50526,0.54921,0.24973,0.94166],
  [0.47968,-0.38347,0.21555,-0.6258,-0.33059,0.50438,-0.53744,-0.23741,0.5528,-0.65396,-0.55399,0.47284,0.46339,-0.42283,0.050192],
  [0.29676,-0.78009,0.57495,0.12991,0.46187,-1.5767,0.42801,0.29465,-0.32807,-1.4112,-1.0229,-0.20984,0.50515,0.29214,-0.0032603],
  [-0.31729,0.57371,0.737,0.98621,-0.82052,1.0584,-0.2323,1.0564,-0.30495,0.50362,-1.0282,0.35328,-1.3139,-0.20175,0.42149],
  [0.07855,0.47736,0.80173,-0.3678,-0.017869,-0.12851,0.5865,0.78896,-0.51335,0.47783,0.46761,0.31385,-0.15024,0.21006,-0.99177],
  [-1.0357,0.074968,-0.080944,0.17253,-0.74572,-0.86043,0.49475,0.29089,-0.22463,-0.79486,1.0884,0.60062,-0.02949,0.65687,-1.1619],
  [-0.79905,0.29018,-0.018132,-0.083586,0.48707,-0.022609,0.77967,-0.10936,-0.50198,0.48897,-0.019646,0.29836,0.59505,-0.0095504,-0.5616],
  [-0.15513,-0.27419,-0.15929,0.9958,0.5185,-0.2523,0.12308,0.73261,-0.52983,0.31304,-0.94747,-0.39099,-0.0099278,0.70341,-0.25081],
  [0.15932,0.42231,1.1889,-0.51392,-1.1255,-0.46426,-0.70125,0.53908,1.2267,-0.15453,0.60088,-0.77683,0.049991,0.085454,0.43638],
  [0.3402,-0.41401,0.20384,0.50423,1.3848,-0.054666,-0.90942,0.036558,-0.32878,-0.57169,-0.046263,-0.10411,1.3483,-0.51306,0.2503],
  [-0.66906,-0.91801,1.0403,0.44691,0.0043169,0.88046,0.83768,-0.93047,0.90852,0.4624,-1.1713,-0.093215,-0.4431,0.22218,-0.4304],
  [-0.57333,0.27284,0.42514,-0.80217,-0.26105,0.87796,-0.95612,-0.35019,-0.92223,-0.14398,-0.63841,0.037699,-1.206,-0.22948,0.080865],
  [0.77479,0.23451,-1.4273,1.6226,0.18947,0.2139,0.78344,-0.63061,0.24653,0.19753,-0.13382,0.12853,-0.43193,-0.44148,0.16818],
  [-0.40199,0.18668,-0.79611,0.004453,0.36192,0.66783,-0.56941,-0.96817,-0.68751,-0.21596,0.066186,-0.24582,0.13305,-0.12034,-0.071343]
]);

var lw7 = math.matrix([
  [-0.6973, -1.2268, -0.62766, 1.4876, 1.954, -0.17127, 0.87015, -0.93006, 1.8047, -2.8451, -2.5471, -0.83114, 2.0565, 1.6818, -0.40064]
]);

var b1 = math.matrix([
  [-2.5805],
  [-1.1944],
  [2.6144],
  [2.3791],
  [1.0649],
  [-0.81351],
  [-0.28732],
  [0.16938],
  [-0.012964],
  [-0.72654],
  [-1.2508],
  [-1.8171],
  [-1.8055],
  [-1.7005],
  [-3.2554]
]);

var b2 = math.matrix([
  [-1.7588],
  [1.8937],
  [0.80197],
  [0.75256],
  [0.46402],
  [0.3129],
  [-0.10717],
  [0.065805],
  [-0.22183],
  [-0.88351],
  [-0.7659],
  [0.69583],
  [1.1747],
  [1.7824],
  [-1.5717]
]);

var b3 = math.matrix([
  [1.3612],
  [-1.5157],
  [0.98144],
  [0.80898],
  [-0.51094],
  [-0.58999],
  [0.035164],
  [-0.10062],
  [0.44117],
  [-0.54253],
  [-0.54127],
  [0.76597],
  [-1.3916],
  [-1.8421],
  [1.3959]
]);

var b4 = math.matrix([
  [1.2435],
  [-1.7306],
  [1.2903],
  [-1.1342],
  [0.78992],
  [0.21209],
  [0.97841],
  [-0.22839],
  [-0.12178],
  [-0.0623],
  [-0.17031],
  [1.2363],
  [-1.2026],
  [1.3136],
  [1.5971]
]);

var b5 = math.matrix([
  [-1.6018],
  [-1.1547],
  [-0.7031],
  [-1.2379],
  [1.2582],
  [0.41843],
  [-0.47672],
  [0.35597],
  [0.014522],
  [0.3483],
  [0.41551],
  [-0.71413],
  [-1.4031],
  [-1.1434],
  [-1.5634]
]);

var b6 = math.matrix([
  [-1.6855],
  [1.3839],
  [1.3522],
  [0.82298],
  [-0.88871],
  [1.0397],
  [-0.58925],
  [-0.000063009],
  [0.05056],
  [0.39284],
  [0.25566],
  [-0.81172],
  [-1.0973],
  [1.5789],
  [-1.747]
]);

var b7 = math.matrix([
  [-1.6509],
  [1.5934],
  [-1.2005],
  [-1.0453],
  [0.67188],
  [-0.33639],
  [0.11418],
  [0.078781],
  [-0.67552],
  [-0.6482],
  [1.1439],
  [-1.1082],
  [-0.70082],
  [-1.5036],
  [-1.6365]
]);

var b8 = math.matrix([
  [-0.74173]
]);

//QList<double> etp_value;
var i1 = math.zeros(3,1);
var tmp = math.zeros(15,1);
var tmp2 = math.zeros(15,1);
var tmp3 = math.zeros(1,1);

var computeETp = function(latitude, longitude)
{
  var m_ETp = [];
  for(var day=1;day<=365;day++)
  {
      i1.subset(math.index(0,0),(day-1)*0.00549 - 1);
      var buff1 = (latitude-14.25)*0.777/4.0;
      i1.subset(math.index(1,0), buff1*2.574 - 1);
      buff1 = (longitude-101.25)*0.777/4.5;
      i1.subset(math.index(2,0), buff1*2.574 -1);
      tmp = math.add(math.dotDivide(2, math.add(math.exp(math.multiply(math.add(math.multiply(iw,i1), b1), -2)), 1)), -1);
      //console.log("Layer 1", tmp);
      tmp2 = math.add(math.dotDivide(2, math.add(math.exp(math.multiply(math.add(math.multiply(lw1, tmp), b2), -2)), 1)), -1);
      //console.log("Layer 2", tmp2);
      tmp = math.add(math.dotDivide(2, math.add(math.exp(math.multiply(math.add(math.multiply(lw2, tmp2), b3), -2)), 1)), -1);
      tmp2 = math.add(math.dotDivide(2, math.add(math.exp(math.multiply(math.add(math.multiply(lw3, tmp), b4), -2)), 1)), -1);
      tmp = math.add(math.dotDivide(2, math.add(math.exp(math.multiply(math.add(math.multiply(lw4, tmp2), b5), -2)), 1)), -1);
      tmp2 = math.add(math.dotDivide(2, math.add(math.exp(math.multiply(math.add(math.multiply(lw5, tmp), b6), -2)), 1)), -1);
      tmp = math.add(math.dotDivide(2, math.add(math.exp(math.multiply(math.add(math.multiply(lw6, tmp2), b7), -2)), 1)), -1);
      tmp3 = math.add(math.multiply(lw7,tmp), b8);
      //double out = tmp3(0,0);
      m_ETp.push( 5.56*(((tmp3.subset(math.index(0,0))+1)*0.5144/2)+0.4856) );
      //qDebug() << "ETp value of day: " + QString::number(day) + " from ANN: " + QString::number(m_ETp.last());
  }
  m_ETp.push(m_ETp[m_ETp.length-1]);
  return m_ETp;
}

var computeWateringSchedule = function(farm_id, callback, res)
{
  // read farm information
  var ref = db.ref('/farm/' + farm_id);
  ref.once('value', function(snapshot1) {
    var farmObj = JSON.parse(JSON.stringify(snapshot1));
    //res.redirect('../farm');
    //console.log("Edit farm[" + farm_id + "].......................................");
    ref = db.ref('/soil/' + farmObj.soil_id);
    ref.once('value', function(snapshot2){
      var soil = JSON.parse(JSON.stringify(snapshot2));

      //console.log("Soil.............. ", soil);
      ref = db.ref('/plant/' + farmObj.plant_id);
      ref.once('value', function(snapshot3){
        var plant = JSON.parse(JSON.stringify(snapshot3));
        //console.log("Plant.............. ", plant);
        // compute watering schedule
        var etp = computeETp(farmObj.latitude, farmObj.longitude);
        //console.log("Week.............. ", weeks);
        var days = plant.weeks*7;
        console.log("อายุ" + plant.title + " => " + days + " วัน");
        var start_date = moment(farmObj.starting_date, "YYYY-MM-DD");
        //var stop_date = start_date.
        var farm_total_drip_per_rai = Math.floor(1600/(farmObj.tape_interval*farmObj.drip_interval));
        var farm_total_flowrate_per_rai = farm_total_drip_per_rai*farmObj.drip_flowrate/1600;
        console.log("แปลง" + farmObj.plant_title);
        console.log("ความสูงของน้ำไหลเข้าแปลง " + farm_total_flowrate_per_rai + " มิลลิเมตร/ชั่วโมง");
        console.log("วันเริ่มปลูก " + start_date.format("YYYY-MM-DD") + " ETp จำนวนวัน => " + etp.length);
        var next_watering = [];

        var ii = 0;
        for(var i=0; i<days; i++)
        {
          var doy = start_date.dayOfYear();
          console.log("วันที่รดน้ำ => " + start_date.dayOfYear(doy).format("YYYY-MM-DD"));
          var week = Math.floor(i/7);
          console.log("สัปดาห์ที่ " + week + " จากทั้งหมด " + plant.weeks + " สัปดาห์");
          var a = soil.water_holding_capacity * plant.root_depth[week] * soil.water_allowance/100;
          console.log("ค่า ETp ประจำวัน => " + etp[doy]);
          console.log("ค่า Kc => " + plant.kc[week]);
          if(plant.kc[week] > 0)
          {
            var ETc = plant.kc[week] * etp[doy];
            console.log("ค่า ETc ประจำวัน => " + ETc);
            var b = Math.floor(a/ETc);  // ต้องให้น้ำห่างกัน (วัน)
            console.log("วันที่รดน้ำครั้งต่อไป => " + start_date.dayOfYear(doy + b).format("YYYY-MM-DD"));
            if((i+b) > days)
            {
              console.log("จำนวนวันที่ผ่านมา => " + i + ", จำนวนวันที่ต้องรดน้ำครั้งต่อไป => " + b + ", จำนวนวันทั้งหมดที่ต้องพิจารณา => " + days);
              break;
            }
            console.log("a = " + a + " farm total flowrate per rai = " + farm_total_flowrate_per_rai);
            var time_to_water = a/farm_total_flowrate_per_rai;
            var hours = Math.floor(time_to_water);
            var mins = Math.ceil((time_to_water - hours)*60);
            var total_mins = hours*60 + mins;

            /*var accumulate_ETc = 0;
            for(var j=0;j < b;j++)
            {
              var pweek = Math.floor((i+j)/7);
              accumulate_ETc += plant.kc[pweek]*etp[i+j];
            }
            var c = accumulate_ETc/farm_total_flowrate_per_rai;
            console.log("accumulated ETc = " + accumulate_ETc);
            var hours = parseInt(c);
            var mins = Math.ceil((c - hours)*60);
            var total_mins = hours*60 + mins;*/
            next_watering.push({current_date: start_date.dayOfYear(doy).format("YYYY-MM-DD"),
                                next_date:start_date.dayOfYear(doy+b).format("YYYY-MM-DD"),
                                days: b,
                                hours: hours,
                                mins: mins,
                                total_mins: total_mins,
                                watering_complete: false});
            console.log("วันที่ " + doy + " ของปี ต้องให้น้ำห่างกัน " + b + " วัน เป็นเวลา " + time_to_water + " ชม. หรือ " + hours + " ชั่วโมง " + mins + " นาที รวม " + total_mins + " นาที");
            console.log("day[" + (i+1) + "] of " + days + " @" + next_watering[next_watering.length - 1].next_date);
            i = i+b;
            console.log("next day = " + i);
            ii++;
            console.log("day of " + ii);
          }
        }

        console.log("compute watering schedule finished....!!!!!!!!!!");
        callback(next_watering);
      });
    });
  });
}

module.exports.computeETp = computeETp;
module.exports.computeWateringSchedule = computeWateringSchedule;
