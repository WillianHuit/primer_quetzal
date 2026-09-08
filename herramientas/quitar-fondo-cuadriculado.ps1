param([Parameter(Mandatory = $true)][string]$Ruta)

Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public static class FondoCuadriculado {
  public static void Quitar(string ruta) {
    using (var fuente = new Bitmap(ruta)) {
      int w = fuente.Width, h = fuente.Height;
      using (var bmp = new Bitmap(w, h, PixelFormat.Format32bppArgb)) {
        using (var g = Graphics.FromImage(bmp)) g.DrawImageUnscaled(fuente, 0, 0);
        var rect = new Rectangle(0, 0, w, h);
        var data = bmp.LockBits(rect, ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
        int stride = data.Stride;
        byte[] px = new byte[stride * h];
        Marshal.Copy(data.Scan0, px, 0, px.Length);
        bool[] fondo = new bool[w * h];
        var cola = new Queue<int>();
        Action<int,int> agregar = (x,y) => {
          if (x < 0 || y < 0 || x >= w || y >= h) return;
          int i = y*w+x;
          if (fondo[i]) return;
          int p = y*stride+x*4;
          int b=px[p], gr=px[p+1], r=px[p+2];
          int max=Math.Max(r,Math.Max(gr,b)), min=Math.Min(r,Math.Min(gr,b));
          if (max-min > 14 || min < 168) return;
          fondo[i]=true; cola.Enqueue(i);
        };
        for(int x=0;x<w;x++){ agregar(x,0); agregar(x,h-1); }
        for(int y=0;y<h;y++){ agregar(0,y); agregar(w-1,y); }
        int[] dx={-1,0,1,-1,1,-1,0,1}, dy={-1,-1,-1,0,0,1,1,1};
        while(cola.Count>0){ int i=cola.Dequeue(), x=i%w, y=i/w; for(int n=0;n<8;n++) agregar(x+dx[n],y+dy[n]); }
        for(int y=0;y<h;y++) for(int x=0;x<w;x++) if(fondo[y*w+x]) px[y*stride+x*4+3]=0;
        Marshal.Copy(px,0,data.Scan0,px.Length);
        bmp.UnlockBits(data);
        string temp=ruta+".alpha.png";
        bmp.Save(temp,ImageFormat.Png);
        fuente.Dispose();
        System.IO.File.Delete(ruta);
        System.IO.File.Move(temp,ruta);
      }
    }
  }
}
'@

[FondoCuadriculado]::Quitar((Resolve-Path -LiteralPath $Ruta).Path)
