function hexToDec(hex) { 
   var i, hash, dec = []; 
   hash = { 
      'A' : 10, 'B' : 11, 'C' : 12, 
      'D' : 13, 'E' : 14, 'F' : 15 
   } 
   for (i = 0; i <= 9; i++) hash[''+i] = i; 
   for (i = 0; i < hex.length; i++) { 
      if (i % 2 == 0) dec[parseInt(i / 2)] = hash[hex.charAt(i)] * 16; 
      else dec[parseInt(i / 2)] += hash[hex.charAt(i)]; 
   } 
   return dec; 
} 

// Функция обратно собирающая шестнадцатеричное представление 
function decToHex(decArray) { 
   var hex = ['0','1','2','3','4','5','6','7','8','9', 
   'A','B','C','D','E','F']; 
   var out = "#"; 
   for (var i = 0; i < decArray.length; i++) { 
      dec = parseInt(decArray[i]); 
      out += hex[parseInt(dec / 16)] + hex[dec % 16]; 
   } 
   return out; 
} 

// Функция для получения всех потомков узла 
function nodeList(parentNode, list, level) { 
   var i, node, count; 
   if (typeof list == "undefined") list = new Array(); 
   if (typeof level == "undefined") level = 0; 
   level++; 
   for (i = 0; i < parentNode.childNodes.length; i++) { 
      node = parentNode.childNodes[i]; 
      count = list.length; 
      list[count] = new Array(); 
      list[count][0] = node; 
      list[count][1] = level; 
      nodeList(node, list, level); 
   } 
   return list; 
} 

// Функция для выставления тестового градиента, принимает 3 аргумента: 
// tagName - имя тега с текстом 
// className - название класса элемента (можно пропустить указав пустую строку или false) 
// colors - массив с 2-мя цветами формата ["RRGGBB", "RRGGBB"] 
function textGradient(tagName, className, colors) { 
   var i, j, k, count, rgb = [], tags, text, html = "", simb, childs, child, newchild; 
   var red, green, blue; 
   rgb[0] = hexToDec(colors[0]); 
   rgb[1] = hexToDec(colors[1]); 
   tags = document.getElementsByTagName(tagName); 
   for (i = 0; i < tags.length; i++) { 
      if (className) if (tags[i].className.indexOf(className) == -1) continue; 
      text = tags[i].innerText ? tags[i].innerText : tags[i].textContent; 
      childs = nodeList(tags[i]); 
      count = 0; 
      for (j = 0; j < childs.length; j++) { 
         child = childs[j][0]; 
         // Отсортировываем только текстовые узлы 
         if (child.nodeType != 3) continue; 
         // Все символы текстового узла обрамляем в SPAN-ы c нужным цветом 
         html = ""; 
         for (k = 0; k < child.nodeValue.length; k++) { 
            simb = childs[j][0].nodeValue.charAt(k); 
            if (simb == " ") {html += " "; continue;} 
            red = parseInt(rgb[0][0] + (rgb[1][0] - rgb[0][0]) * (count / text.length)); 
            green = parseInt(rgb[0][1] + (rgb[1][1] - rgb[0][1]) * (count / text.length)); 
            blue = parseInt(rgb[0][2] + (rgb[1][2] - rgb[0][2]) * (count / text.length)); 
            html += "<span style=\"color:" + decToHex([red, green, blue]) + "\">" + simb + "<\/span>"; 
            count++; 
         } 
         // Заменяем текстовый узел на узел с подсвеченными span-ами 
         newchild = document.createElement("span"); 
         newchild.innerHTML = html; 
         child.parentNode.replaceChild(newchild, child); 
      } 
   } 
}