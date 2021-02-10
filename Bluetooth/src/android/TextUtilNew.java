package cordova.plugins.bluetooth;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Rect;
import android.graphics.Bitmap.CompressFormat;
import android.graphics.Bitmap.Config;
import android.graphics.Typeface;
import android.os.Environment;
import android.text.TextPaint;
import android.util.Log;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;

public class TextUtilNew {
    private int width;

    public String drawCanvas(String rawStr, float startY, int extraEndY, int textSize) {
        this.width = 768;
        TextPaint e = getTextPaint(30, textSize);
        String[] rawArr = getSplitedRawString(rawStr);
        String[] optArr = getOptimizeArray(rawArr, e);
        Bitmap bitmap = Bitmap.createBitmap(width, optArr.length * ((int)getCharHeight_plus_footer(e) + 30) + extraEndY, Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);
        canvas.drawColor(-1);
        intelPrint(canvas, optArr, e, startY);
        // saving
        canvas.save();
        canvas.restore();
        return writeFile(bitmap);
    }

    // #i
    public void intelPrint(Canvas canvas, String arr[], TextPaint e, float startY) {

        float charHeight = getCharHeight_plus_footer(e);
        Log.i("charHeight",": "+charHeight);
        float baseY = startY;
        float baseX = 3;
        for (int i = 0; i < arr.length; i++) {
            Log.i(">>>> ", arr[i]);
            if (arr[i].contains("->")) {
                // print transaction
                String[] txt = diagnosisString(arr[i], "->");
                Log.d("txtLength", txt.length + "");
                if (txt.length == 4) {
                    canvas.drawText(txt[0], getRightMostBaseX(60, 0, e.measureText(txt[0])) + baseX, baseY, e);
                    canvas.drawText(txt[1], baseX + 80, baseY, e);
                    canvas.drawText(txt[2], getRightMostBaseX(600, 0, e.measureText(txt[2])) + baseX, baseY, e);
                    canvas.drawText(txt[3], getRightMostBaseX(width, baseX, e.measureText(txt[3])), baseY, e);
                } else if (txt.length == 3) {
                    canvas.drawText(txt[0], baseX, baseY, e);
                    canvas.drawText(txt[1], getRightMostBaseX(564, 0, e.measureText(txt[1])) + baseX, baseY, e);
                    canvas.drawText(txt[2], getRightMostBaseX(width, baseX, e.measureText(txt[2])), baseY, e);
                } else if (txt.length == 2) {
                    TextPaint e1 = e;
                    boolean flag = false; // for update baseY if textSize is changed.
                    if(txt[0].contains("@__B")){
                        txt[0] = txt[0].replace("@__B","");
                        e1 = getTextPaint(30,e.getTextSize()+10);
                        flag = true;
                    }
                    canvas.drawText(txt[0], baseX, baseY, e1);
                    canvas.drawText(txt[1], getRightMostBaseX(this.width, baseX, e1.measureText(txt[1])), baseY, e1);

                    if(flag){
                        baseY = baseY + getCharHeight_plus_footer(e1) + 30;
                        continue;
                    }
                } else {
                    canvas.drawText(txt[0], baseX, baseY, e);
                }
            } else if (arr[i].contains("<>")) {
                Log.d("000000000", "Here is <>");
                String[] txt = diagnosisString(arr[i], "<>");
                canvas.drawText(txt[0], baseX, baseY, e);
                canvas.drawText(txt[1], getRightMostBaseX(width, baseX, e.measureText(txt[1])), baseY, e);
            } else if (arr[i].contains("@_C")) {
                // add text follow @_C to center
                String str = arr[i].replace("@_C", "");
                canvas.drawText(str, getCenterMostBaseX(e.measureText(str)), baseY, e);
            } else if (arr[i].contains("@_L")) {
                // adding long line follow @_L
                String cleanStr = arr[i].replace("@_L", "");
                canvas.drawText(getLineFeed(748, e.measureText(cleanStr), cleanStr), baseX, baseY, e);
            } else {
                // print direct
                canvas.drawText(arr[i], baseX, baseY, e);
            }
            // increase baseY
            baseY = baseY + charHeight + 30;
            Log.d("baseY", baseY + "");
        }
    }

    private TextPaint getTextPaint(float sw, float ts) {
        TextPaint e = new TextPaint();
        e.setStrokeWidth(sw);
        e.setTextSize(ts);
        e.setColor(Color.BLACK);
        return e ;
    }

    private float getCharHeight_plus_footer(TextPaint e) {
        Rect rect = new Rect();
        e.getTextBounds("a", 0, "a".length(), rect);
        return rect.height() + 2;
    }


    private float getRightMostBaseX(float width, float s, float textLen) {
        return width - s - textLen;
    }

    private float getCenterMostBaseX(float textLen) {
        Log.d("textLen", textLen + "");
        Log.d("Center", ((width - textLen) / 2.0f) + "");
        return (width - textLen) / 2.0f;
    }

    private String[] getSplitedRawString(String rawStr) {
        return rawStr.split(";");
    }

    private String[] diagnosisString(String rawStr, String spc) {
        return rawStr.split(spc);
    }

    private String getLineFeed(float width, float tw, String cleanStr) {
        return new String(new char[(int) Math.ceil(width / tw)]).replace("\0", cleanStr);
    }

    private String writeFile(Bitmap bitmap) {
        try {
            String path = Environment.getExternalStorageDirectory() + "/retailer_mit.png";
            File file = new File(path);
            file.createNewFile();
            FileOutputStream var16 = null;
            try {
                var16 = new FileOutputStream(file);
            } catch (FileNotFoundException e1) {
                Log.e("ERROR", e1.getMessage());
                e1.printStackTrace();
            }
            bitmap.compress(CompressFormat.PNG, 100, var16);
            var16.flush();
            var16.close();
            return path;
        } catch (IOException e1) {
            Log.e("Error", e1.getMessage());
            e1.printStackTrace();
        }
        return "";
    }

    private String stringConcator(String str, TextPaint e, float place_width) {
        while (e.measureText(str) > place_width) {
            str = str.substring(0, str.length() - 2);
        }
        return str;
    }

    private String[] getOptimizeArray(String arr[], TextPaint e) {
        StringBuilder sb = new StringBuilder();
        float max_width_1 = 410;
        float max_width_2 = 450;
        for (String str : arr) {
            if (str.contains("->")) {
                String[] txt = str.split("->");
                if (txt.length == 4) {
                    if (e.measureText(txt[1]) > max_width_1) {
                        int i = 0;
                        int j = txt[1].length();
                        String str1 = stringConcator(txt[1], e, max_width_1);
                        sb.append(txt[0] + "->" + str1 + "->" + txt[2] + "->" + txt[3] + ";");
                        sb.append(handleOverLengthString(e, txt[1].substring(i + str1.length(), j), max_width_1, 4));
                    } else {
                        sb.append(str + ";");
                    }
                } else if (txt.length == 3) {
                    if (e.measureText(txt[0]) > max_width_2) {
                        int i = 0;
                        int j = txt[0].length();
                        String str1 = stringConcator(txt[0], e, max_width_2);
                        sb.append(str1 + "->" + txt[1] + "->" + txt[2] + ";");
                        sb.append(handleOverLengthString(e, txt[0].substring(i + str1.length(), j), max_width_2, 3));
                    } else {
                        sb.append(str + ";");
                    }
                } else {
                    sb.append(str + ";");
                }
            } else if (str.contains("<>")) {
                String[] txt = str.split("<>");
                if (e.measureText(txt[0]) > max_width_2) {
                    int i = 0;
                    int j = txt[0].length();
                    String str1 = stringConcator(txt[0], e, max_width_2);
                    sb.append(str1 + "<>" + txt[1] + ";");
                    sb.append(handleOverLengthString(e, txt[0].substring(i + str1.length(), j), max_width_2, 2));
                } else {
                    sb.append(str + ";");
                }
            } else {
                sb.append(str + ";");
            }
        }
        Log.i("OPT : ", sb.toString());
        return sb.toString().split(";");
    }

    private String handleOverLengthString(TextPaint e, String txt, float place_width, int type) {
        String txt1 = txt;
        StringBuilder txt2 = new StringBuilder(""); // combinator
        int i = 0;
        int j = txt.length();
        while (!(i >= j)) {
            txt1 = txt.substring(i, j);

            String str = stringConcator(txt1, e, place_width);

            if (type == 4) {
                txt2.append(" ->" + str + "-> -> ;");
            } else if (type == 3) {
                // same as others ..
                txt2.append(str + ";");
            } else {
                txt2.append(str + ";");
            }

            i = i + str.length();
        }
        return txt2.toString();
    }
}
