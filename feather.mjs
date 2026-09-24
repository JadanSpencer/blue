import sharp from 'sharp';
async function feather(f){
  const {data, info} = await sharp('img/'+f).raw().toBuffer({resolveWithObject:true});
  const W=info.width, H=info.height, fade=Math.round(Math.min(W,H)*0.14);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const i=(y*W+x)*4+3;
    const d=Math.min(x, y, W-1-x, H-1-y);
    if(d<fade) data[i]=Math.round(data[i]*(d/fade));
  }
  await sharp(data,{raw:{width:W,height:H,channels:4}}).png().toFile('img/'+f);
  console.log('feathered', f);
}
await feather('ghost-desk.png'); await feather('ghost-desk-ink.png');
