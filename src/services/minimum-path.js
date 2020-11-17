const Graph = require('node-dijkstra')

const positions = [
  { id: '0', latitude: -1.2966585134741138, longitude: -45.76293515084839 },
  { id: '1', latitude: -1.2952426693653365, longitude: -45.76250599740601 },
  { id: '2', latitude: -1.2934835892192353, longitude: -45.75941609262085 },
  { id: '3', latitude: -1.291467081210186, longitude: -45.753107537017826 },
  { id: '4', latitude: -1.293569398035146, longitude: -45.75130509255982 },
  { id: '5', latitude: -1.2948565299256245, longitude: -45.752892960296634 },
  { id: '6', latitude: -1.2978598351272268, longitude: -45.76121853707886 },
  { id: '7', latitude: -1.2965298004060202, longitude: -45.75332211373902 },
  { id: '8', latitude: -1.2898367118628187, longitude: -45.753407944427494 },
  { id: '9', latitude: -1.2885924819211994, longitude: -45.75902985452271 },
  { id: '10', latitude: -1.2909522278450112, longitude: -45.759802330719 },
  { id: '11', latitude: -1.2985034000638365, longitude: -45.757356156097416 },
  { id: '12', latitude: -1.2970446526391015, longitude: -45.755124558197025 },
  { id: '13', latitude: -1.2962294698883738, longitude: -45.75546788095093 },
  { id: '14', latitude: -1.3006486153353336, longitude: -45.75246380685425 },
  { id: '15', latitude: -1.2977740264566364, longitude: -45.74752854226685 },
  { id: '16', latitude: -1.2957146174895513, longitude: -45.74851559518433 },
  { id: '17', latitude: -1.2979027394614349, longitude: -45.76516674874878 },
];

const path = (a, b) => {

  const route = new Graph();

  route.addNode('0', { 1: 0.16363312966984025, 6: 0.23268505519947796, 17: 0.283915711850108 });
  route.addNode('1', { 0: 0.16363312966984025, 2: 0.39507535596590015 });
  route.addNode('2', { 1: 0.39507535596589716, 3: 0.7366369265018788, 10: 0.2831640376096663 });
  route.addNode('3', { 2: 0.7366369265018788, 4: 0.3070458752328239, 8: 0.18333106359084755 });
  route.addNode('4', { 3: 0.3070458752328239, 5: 0.22644149797716925, 16: 0.3906945476104698 });
  route.addNode('5', { 4: 0.2264414979771664, 7: 0.19104649114966762, 13: 0.32429204148602875 });
  route.addNode('6', { 0: 0.2326850551994757, 11: 0.4356945810820275, 13: 0.6648963289113172 });
  route.addNode('7', { 5: 0.19104649114967362, 12: 0.20851595565686493, 16: 0.5424586698955118 });
  route.addNode('8', { 3: 0.1833310635908426, 9: 0.640611869156759 });
  route.addNode('9', { 8: 0.6406118691567544, 10: 0.2746359668075791 });
  route.addNode('10', { 2: 0.2831640376096723, 9: 0.27463596680758756 });
  route.addNode('11', { 6: 0.43569458108202885, 12: 0.2961380664912207, 14: 0.5938965240074991 });
  route.addNode('12', { 7: 0.20851595565686262, 11: 0.29613806649121344, 13: 0.0978524944252317 });
  route.addNode('13', { 5: 0.3242920414860227, 6: 0.6648963289113172, 12: 0.09785249442524212 });
  route.addNode('14', { 11: 0.5938965240074991, 15: 0.634588737304151 });
  route.addNode('15', { 14: 0.6345887373041414, 16: 0.25266992055877885 });
  route.addNode('16', { 4: 0.3906945476104625, 7: 0.5424586698955101, 15: 0.25266992055877074 });
  route.addNode('17', { 0: 0.2839157118501141 });

  const vet = route.path(a, b) // => [ 'A', 'B', 'C', 'D' ]
  let result = [];
  for (let i = 0; i < vet.length; i++) {
    result.push({latitude: positions[parseInt(vet[i])].latitude.toString() ,longitude:positions[parseInt(vet[i])].longitude.toString() });
  }

  return result;
}

module.exports = path;