import * as T from 'three';
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import fs from 'node:fs/promises';
globalThis.FileReader=class{readAsArrayBuffer(blob){blob.arrayBuffer().then(x=>{this.result=x;this.onloadend?.()})}readAsDataURL(blob){blob.arrayBuffer().then(x=>{this.result='data:application/octet-stream;base64,'+Buffer.from(x).toString('base64');this.onloadend?.()})}};
const mat=(name,color,metalness=0,roughness=.4,extra={})=>new T.MeshPhysicalMaterial({name,color,metalness,roughness,...extra});
const paint=mat('bodypaint','#ffffff',.65,.23,{clearcoat:1,clearcoatRoughness:.12});
const glass=mat('glass','#20353e',.25,.12,{clearcoat:1});const rubber=mat('rubber','#15191d',0,.88);const chrome=mat('alloy','#aab7c2',.9,.23);const trim=mat('trim','#263038',.3,.55);const head=mat('headlamp','#edf9ff',.3,.14,{emissive:'#dbefff',emissiveIntensity:.35});const tail=mat('taillamp','#a51622',.15,.22,{emissive:'#c81b27',emissiveIntensity:.4});
function add(group,g,m,p=[0,0,0],rot=[0,0,0],name=''){let mesh=new T.Mesh(g,m);mesh.position.set(...p);mesh.rotation.set(...rot);mesh.name=name||m.name;group.add(mesh);return mesh}
function loft(rings){const pos=[],idx=[];const N=32;for(const [z,w,bottom,top] of rings){for(let j=0;j<N;j++){const a=j/N*Math.PI*2;const cos=Math.cos(a),sin=Math.sin(a);pos.push(w*Math.sign(cos)*Math.pow(Math.abs(cos),.38),(bottom+top)/2+(top-bottom)/2*Math.sign(sin)*Math.pow(Math.abs(sin),.38),z)}}for(let k=0;k<rings.length-1;k++)for(let j=0;j<N;j++){const a=k*N+j,b=k*N+(j+1)%N,c=b+N,d=a+N;idx.push(a,b,c,a,c,d)}for(const end of [0,rings.length-1]){const base=end*N;for(let j=1;j<N-1;j++)idx.push(base,base+(end?j:j+1),base+(end?j+1:j))}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return g}
function pane(g,points,m){const geom=new T.BufferGeometry();geom.setAttribute('position',new T.Float32BufferAttribute(points.flat(),3));geom.setIndex([0,1,2,0,2,3]);geom.computeVertexNormals();m.side=T.DoubleSide;add(g,geom,m)}
for(const type of ['compact','sedan','suv','van']){
 const g=new T.Group();g.name='ParkPulse original '+type;
 const L=type==='compact'?3.8:type==='van'?5.6:type==='suv'?4.7:4.5,W=type==='van'?1.95:type==='suv'?1.9:1.78,H=type==='van'?2.35:type==='suv'?1.75:1.48;
 const b=.38,hood=type==='van'?1.13:type==='suv'?.98:.84,half=L/2;
 add(g,loft([[-half,.64*W/2,b+.08,hood-.12],[-half+.22,W/2,b,hood],[-half*.65,W/2,b,hood+.07],[half*.65,W/2,b,hood],[half-.15,.9*W/2,b+.04,hood-.04],[half,.72*W/2,b+.14,hood-.14]]),paint);
 const rear=type==='van'?-half+.16:-half*.62,front=type==='van'?half*.25:half*.3,roofRear=type==='sedan'?rear+.45:rear+.22,roofFront=front-.36;
 add(g,loft([[rear,W*.43,hood,H-.12],[roofRear,W*.39,hood,H],[roofFront,W*.39,hood,H],[front,W*.44,hood,hood+.1]]),paint);
 // Windscreen and rear glass follow the cabin slopes, with inset seals and pillars.
 pane(g,[[-W*.38,H-.07,roofFront+.025],[W*.38,H-.07,roofFront+.025],[W*.43,hood+.10,front+.025],[-W*.43,hood+.10,front+.025]],glass);
 if(type!=='van')pane(g,[[-W*.38,H-.08,roofRear-.026],[-W*.43,hood+.12,rear-.026],[W*.43,hood+.12,rear-.026],[W*.38,H-.08,roofRear-.026]],glass);
 for(const side of [-1,1]){
  const lowerX=side*W*.443,upperX=side*W*.398;
  const split=(roofRear+roofFront)/2;
  pane(g,[[lowerX,hood+.14,rear+.12],[upperX,H-.10,roofRear+.10],[upperX,H-.10,split-.06],[lowerX,hood+.14,split-.06]],glass);
  pane(g,[[lowerX,hood+.14,split+.07],[upperX,H-.10,split+.07],[upperX,H-.10,roofFront-.08],[lowerX,hood+.14,front-.11]],glass);
  for(const z of [split-.15,front-.3])add(g,new T.BoxGeometry(.035,.05,.19),chrome,[side*(W/2+.016),hood-.05,z]);
  add(g,new T.SphereGeometry(.13,16,10),paint,[side*(W/2+.15),hood+.2,front-.2]).scale.set(1,.55,1.45);
  add(g,new T.BoxGeometry(.06,.13,L*.72),trim,[side*(W/2),.42,0]);
 }
 const radius=type==='van'?.38:type==='suv'?.36:.31;
 for(const x of [-W/2,W/2])for(const z of [-half*.64,half*.63]){
  add(g,new T.CylinderGeometry(radius,radius,.23,32),rubber,[x,radius,z],[0,0,Math.PI/2]);
  add(g,new T.CylinderGeometry(radius*.69,radius*.69,.245,24),chrome,[x,radius,z],[0,0,Math.PI/2]);
  add(g,new T.CylinderGeometry(radius*.47,radius*.47,.255,24),trim,[x,radius,z],[0,0,Math.PI/2]);
  for(let i=0;i<5;i++){const a=i*Math.PI*2/5;add(g,new T.BoxGeometry(.27,.042,radius*.9),chrome,[x,radius+Math.sin(a)*radius*.23,z+Math.cos(a)*radius*.23],[a,0,0]);}
  add(g,new T.CylinderGeometry(radius*.18,radius*.18,.28,16),chrome,[x,radius,z],[0,0,Math.PI/2]);
 }
 // Bumpers, grille, LED lamps, rear plates and panel details.
 for(const dir of [-1,1]){
  add(g,new T.BoxGeometry(W*.76,.14,.1),trim,[0,.43,dir*(half-.02)]);
  add(g,new T.BoxGeometry(.4,.11,.04),chrome,[0,.6,dir*(half+.016)]);
  for(const side of [-1,1])add(g,new T.BoxGeometry(W*.23,.12,.065),dir===1?head:tail,[side*W*.30,hood-.18,dir*(half-.04)]);
 }
 for(let j=0;j<4;j++)add(g,new T.BoxGeometry(W*.38,.025,.04),chrome,[0,.64+j*.043,half+.01]);
 if(type==='van'){for(const side of [-1,1])add(g,new T.BoxGeometry(.02,.02,L*.55),trim,[side*(W/2+.02),1.13,-.45]);}
 if(type==='suv'){for(const side of [-1,1])add(g,new T.BoxGeometry(.055,.06,1.6),chrome,[side*W*.29,H+.02,-.25]);}
 g.updateMatrixWorld(true);
 const buffer=await new GLTFExporter().parseAsync(g,{binary:true});await fs.writeFile('/tmp/realistic-cars/parkpulse-real-'+type+'.glb',Buffer.from(buffer));
 console.log(type,'bytes',buffer.byteLength);
}
