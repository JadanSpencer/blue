import sharp from 'sharp';
function stats(data, W, x0, y0, x1, y1){
  let n=0, sum=0, sum2=0;
  for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){
    const i=(y*W+x)*3; const v=(data[i]+data[i+1]+data[i+2])/3;
    sum+=v; sum2+=v*v; n++;
  }
  const m=sum/n; return {m, sd: Math.sqrt(sum2/n - m*m)};
}
const a = await sharp('shot-g-hero.png').resize({width:1440}).raw().toBuffer({resolveWithObject:true});
// reg mark sits around x: 1440-6%-420 ... top 10% + 420px tall => sample ring region
const g1 = stats(a.data, a.info.width, 1050, 120, 1380, 420);   // ghost region (reg mark circle edge ~x1090-1370, y130-410)
const g0 = stats(a.data, a.info.width, 1050, 500, 1380, 800);  // empty region below it
console.log('hero ghost region sd:', g1.sd.toFixed(2), 'vs empty:', g0.sd.toFixed(2), '| mean', g1.m.toFixed(1), g0.m.toFixed(1));
const s = await sharp('shot-g-stats.png').raw().toBuffer({resolveWithObject:true});
const d1 = stats(s.data, s.info.width, 500, 300, 900, 600);
const d0 = stats(s.data, s.info.width, 1200, 400, 1380, 800);
console.log('stats dots region sd:', d1.sd.toFixed(2), 'vs edge:', d0.sd.toFixed(2));
const f = await sharp('shot-g-faq.png').raw().toBuffer({resolveWithObject:true});
const f1 = stats(f.data, f.info.width, 100, 200, 900, 600);
console.log('faq text region sd:', f1.sd.toFixed(2));
