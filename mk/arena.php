<?php
require_once('circuitEnumsQuick.php');
$elements = Array('a','b','c','d','e','f','g','h','i','j');
$getInfos = Array();
foreach ($circuitsData as $c => $arene) {
	if ($c)
		echo ',';
	$pieces = Array(
		Array(false,true,true,true),
		Array(true,false,true,true),
		Array(true,true,false,true),
		Array(true,true,true,false),
		Array(false,true,true,false),
		Array(false,false,true,true),
		Array(true,false,false,true),
		Array(true,true,false,false),
		Array(false,true,false,true),
		Array(true,false,true,false),
		Array(false,false,false,false),
		Array(true,true,true,true),
		Array(false,false,true,false),
		Array(false,false,false,true),
		Array(true,false,false,false),
		Array(false,true,false,false)
	);
	$map = $arene['map'];
	$snes = ($map < 14);
	if ($map == 29)
		$pieces[10] = Array(true,true,true,true);
	$chemins = Array();
	for ($i=0;$i<36;$i++) {
		$chemins[$i] = Array();
		$piece = $pieces[$arene["p$i"]];
		$directions = Array();
		if ($i>5)
			$directions[0] = -6;
		if ($i<30)
			$directions[2] = 6;
		if ($i%6)
			$directions[1] = -1;
		if (($i+1)%6)
			$directions[3] = 1;
		for ($j=0;$j<4;$j++) {
			$direction = isset($directions[$j]) ? $directions[$j]:0;
			if ($direction) {
				$dir = $pieces[$arene['p'.($i+$direction)]];
				if ($piece[$j] && $dir[($j+2)%4])
					array_push($chemins[$i], $i+$direction);
			}
		}
	}
	?>
"map<?php echo ($c+1); ?>" : {
	<?php
	if (isset($arene['id']))
		echo '"id" : '.$arene['id'].',';
	?>
	"map" : "?<?php
	for ($i=0;$i<36;$i++)
		echo 'p'.$i.'='.$arene["p$i"].'&';
	for ($i=0;$i<10;$i++) {
		$e = $elements[$i];
		for ($j=0; isset($arene[$e.$j]); $j++)
		echo $e.$j.'='.$arene[$e.$j].'&';
	}
		echo "map=$map";
	?>",
	"w" : 600,
	"h" : 600,
	"skin" : <?php echo $map; ?>,
	"bgcolor" : [<?php echo implode(',',$bgColors[$map]); ?>],
	"fond" : ["<?php echo implode('","',$bgImages[$map]); ?>"],
	"music" : <?php echo $musicIds[$map]; ?>,
	"collision" : [
	<?php
	if ($snes) {
		for ($i=0;$i<36;$i++) {
			$piece = $pieces[$arene["p$i"]];
			$x = ($i%6)*100;
			$y = floor($i/6)*100;
			if (!$piece[0])
				echo "[$x,$y,101,5],";
			if (!$piece[1])
				echo "[$x,$y,5,101],";
			if (!$piece[2])
				echo "[$x,".($y+96).",101,5],";
			if (!$piece[3])
				echo "[".($x+96).",$y,5,101],";
		}
	}
	else {
		for ($i=0;$i<36;$i++) {
			$x = ($i%6)*100;
			$y = floor($i/6)*100;
			$baseCase = false;
			switch ($map) {
			case 26:
				switch ($arene["p$i"]) {
				case 10:
					echo "[$x,$y,100,100],";
					break;
				default:
					$baseCase = true;
				}
				break;
			case 27:
				switch ($arene["p$i"]) {
				case 8:
				case 9:
				case 10:
					break;
				default:
					$piece = $pieces[$arene["p$i"]];
					if ($piece[0])
						echo "[".($x+26).",$y,5,31],[".($x+70).",$y,5,31],";
					else
						echo "[$x,".($y+26).",101,5],";
					if ($piece[1])
						echo "[$x,".($y+26).",31,5],[$x,".($y+70).",31,5],";
					else
						echo "[".($x+26).",$y,5,101],";
					if ($piece[2])
						echo "[".($x+26).",".($y+70).",5,31],[".($x+70).",".($y+70).",5,31],";
					else
						echo "[$x,".($y+70).",101,5],";
					if ($piece[3])
						echo "[".($x+70).",".($y+26).",31,5],[".($x+70).",".($y+70).",31,5],";
					else
						echo "[".($x+70).",$y,5,101],";
				}
				break;
			case 28:
				switch ($arene["p$i"]) {
				case 10:
					break;
				default:
					$baseCase = true;
					$piece = $pieces[$arene["p$i"]];
					if ($piece[0]&&$piece[1])
						echo "[$x,$y,9,9],";
					if ($piece[1]&&$piece[2])
						echo "[$x,".($y+92).",9,9],";
					if ($piece[2]&&$piece[3])
						echo "[".($x+92).",".($y+92).",9,9],";
					if ($piece[3]&&$piece[0])
						echo "[".($x+92).",$y,9,9],";
				}
				break;
			case 29:
				switch ($arene["p$i"]) {
				case 10:
					break;
				default:
					$baseCase = true;
				}
				break;
			case 47:
				$baseCase = false;
				break;
			case 48:
				$baseCase = false;
				switch ($arene["p$i"]) {
				case 0:
					echo "[$x,$y,4,35],[".($x+4).",$y,96,4],[".($x+96).",".($y+4).",4,31],[$x,".($y+65).",4,35],[".($x+4).",".($y+96).",32,4],[".($x+64).",".($y+96).",36,4],[".($x+96).",".($y+64).",4,32],";
					break;
				case 1:
					echo "[$x,".($y+96).",35,4],[$x,$y,4,96],[".($x+4).",$y,31,4],[".($x+65).",".($y+96).",35,4],[".($x+96).",".($y+64).",4,32],[".($x+96).",$y,4,36],[".($x+64).",$y,32,4],";
					break;
				case 2:
					echo "[".($x+96).",".($y+65).",4,35],[$x,".($y+96).",96,4],[$x,".($y+65).",4,31],[".($x+96).",$y,4,35],[".($x+64).",$y,32,4],[$x,$y,36,4],[$x,".($y+4).",4,32],";
					break;
				case 3:
					echo "[".($x+65).",$y,35,4],[".($x+96).",".($y+4).",4,96],[".($x+65).",".($y+96).",31,4],[$x,$y,35,4],[$x,".($y+4).",4,32],[$x,".($y+64).",4,36],[".($x+4).",".($y+96).",32,4],";
					break;
				case 4:
					echo "[$x,".($y+68).",4,32],";
					break;
				case 5:
					echo "[".($x+68).",".($y+96).",32,4],";
					break;
				case 6:
					echo "[".($x+96).",$y,4,32],";
					break;
				case 7:
					echo "[$x,$y,32,4],";
					break;
				case 8:
					echo "[$x,$y,4,36],[".($x+4).",$y,96,4],[".($x+96).",".($y+4).",4,31],[$x,".($y+64).",4,36],[".($x+4).",".($y+96).",96,4],[".($x+96).",".($y+64).",4,32],";
					break;
				case 9:
					echo "[$x,".($y+96).",36,4],[$x,$y,4,96],[".($x+4).",$y,31,4],[".($x+64).",".($y+96).",36,4],[".($x+96).",$y,4,96],[".($x+64).",$y,32,4],";
					break;
				case 10:
					break;
				case 11:
					echo "[$x,$y,36,4],[".($x+64).",$y,36,4],[$x,".($y+4).",4,32],[".($x+96).",".($y+4).",4,31],[$x,".($y+65).",4,35],[".($x+4).",".($y+96).",32,4],[".($x+64).",".($y+96).",36,4],[".($x+96).",".($y+65).",4,31],";
					break;
				case 12:
					echo "[$x,$y,100,4],[$x,".($y+4).",4,96],[".($x+96).",".($y+4).",4,96],[".($x+4).",".($y+96).",32,4],[".($x+65).",".($y+96).",31,4],";
					break;
				case 13:
					echo "[$x,$y,4,100],[".($x+4).",".($y+96).",96,4],[".($x+4).",$y,96,4],[".($x+96).",".($y+64).",4,32],[".($x+96).",".($y+4).",4,31],";
					break;
				case 14:
					echo "[$x,".($y+96).",100,4],[".($x+96).",$y,4,96],[$x,$y,4,96],[".($x+64).",$y,32,4],[".($x+4).",$y,31,4],";
					break;
				case 15:
					echo "[".($x+96).",$y,4,100],[$x,$y,96,4],[$x,".($y+96).",96,4],[$x,".($y+4).",4,32],[$x,".($y+65).",4,31],";
				}
				break;
			case 49:
			case 50:
				$baseCase = false;
				break;
			}
			if ($baseCase) {
				$piece = $pieces[$arene["p$i"]];
				if (!$piece[0])
					echo "[$x,$y,101,9],";
				if (!$piece[1])
					echo "[$x,$y,9,101],";
				if (!$piece[2])
					echo "[$x,".($y+92).",101,9],";
				if (!$piece[3])
					echo "[".($x+92).",$y,9,101],";
			}
		}
	}
	?>
	],
	<?php
	switch ($map) {
	case 29:
		echo '"horspiste" : [';
		for ($i=0;$i<36;$i++) {
			$x = ($i%6)*100;
			$y = floor($i/6)*100;
			if ($arene["p$i"] == 10)
				echo '[['.($x+41).','.($y+4).'],['.($x+58).','.($y+4).'],['.($x+80).','.($y+13).'],['.($x+88).','.($y+23).'],['.($x+95).','.($y+50).'],['.($x+88).','.($y+76).'],['.($x+79).','.($y+87).'],['.($x+58).','.($y+95).'],['.($x+41).','.($y+95).'],['.($x+26).','.($y+90).'],['.($x+13).','.($y+79).'],['.($x+8).','.($y+65).'],['.($x+4).','.($y+49).'],['.($x+7).','.($y+38).'],['.($x+12).','.($y+21).'],['.($x+22).','.($y+11).']],';
		}
		echo '],';
		break;
	case 30:
		echo '"horspiste" : [';
		for ($i=0;$i<36;$i++) {
			if ($arene["p$i"] != 10) {
				$piece = $pieces[$arene["p$i"]];
				$x = ($i%6)*100;
				$y = floor($i/6)*100;
				if (!$piece[0])
					echo "[$x,$y,101,22],";
				if (!$piece[1])
					echo "[$x,$y,22,101],";
				if (!$piece[2])
					echo "[$x,".($y+79).",101,22],";
				if (!$piece[3])
					echo "[".($x+79).",$y,22,101],";
				if ($piece[0]&&$piece[1])
					echo "[$x,$y,22,22],";
				if ($piece[1]&&$piece[2])
					echo "[$x,".($y+79).",22,22],";
				if ($piece[2]&&$piece[3])
					echo "[".($x+79).",".($y+79).",22,22],";
				if ($piece[3]&&$piece[0])
					echo "[".($x+79).",$y,22,22],";
			}
		}
		echo '],';
		echo '"trous" : [';
		for ($j=0;$j<4;$j++) {
			if ($j)
				echo ',';
			echo '[';
			for ($i=0;$i<36;$i++) {
				$x = ($i%6)*100;
				$y = floor($i/6)*100;
				$u = $x+50;
				$v = $y+50;
				if ($arene["p$i"] != 10) {
					$piece = $pieces[$arene["p$i"]];
					if (($j==0)&&!$piece[0])
						echo "[$x,$y,101,8,$u,$v],";
					if (($j==1)&&!$piece[1])
						echo "[$x,$y,8,101,$u,$v],";
					if (($j==2)&&!$piece[2])
						echo "[$x,".($y+93).",101,8,$u,$v],";
					if (($j==3)&&!$piece[3])
						echo "[".($x+93).",$y,8,101,$u,$v],";
					if (($j==2)&&$piece[0]&&$piece[1])
						echo "[$x,$y,8,8,$u,$v],";
					if (($j==3)&&$piece[1]&&$piece[2])
						echo "[$x,".($y+93).",8,8,$u,$v],";
					if (($j==0)&&$piece[2]&&$piece[3])
						echo "[".($x+93).",".($y+93).",8,8,$u,$v],";
					if (($j==1)&&$piece[3]&&$piece[0])
						echo "[".($x+93).",$y,8,8,$u,$v],";
				}
				elseif (!$j)
					echo "[$x,$y,100,100,NaN,NaN],";
			}
			echo ']';
		}
		echo '],';
		break;
	case 27:
		echo '"trous" : [';
		echo '[';
		for ($i=0;$i<36;$i++) {
			$x = ($i%6)*100;
			$y = floor($i/6)*100;
			switch ($arene["p$i"]) {
			case 10:
				echo "[$x,$y,100,100,NaN,NaN],";
				break;
			default:
				$piece = $pieces[$arene["p$i"]];
				if ($piece[0])
					echo "[$x,$y,27,27,NaN,NaN],[".($x+74).",$y,27,27,NaN,NaN],";
				else
					echo "[$x,$y,27,27,NaN,NaN],";
				if ($piece[1])
					echo "[$x,$y,27,27,NaN,NaN],[$x,".($y+74).",27,27,NaN,NaN],";
				else
					echo "[$x,$y,27,101,NaN,NaN],";
				if ($piece[2])
					echo "[$x,".($y+74).",27,27,NaN,NaN],[".($x+74).",".($y+74).",27,27,NaN,NaN],";
				else
					echo "[$x,".($y+74).",101,27,NaN,NaN],";
				if ($piece[3])
					echo "[".($x+74).",".($y+74).",27,27],[".($x+74).",$y,27,27,NaN,NaN],";
				else
					echo "[".($x+74).",$y,27,101,NaN,NaN],";
			}
		}
		echo ']';
		for ($i=0;$i<3;$i++)
			echo ',[]';
		echo '],';
		break;
	case 28:
		echo '"trous" : [';
		echo '[';
		for ($i=0;$i<36;$i++) {
			$x = ($i%6)*100;
			$y = floor($i/6)*100;
			if ($arene["p$i"] == 10)
				echo "[$x,$y,100,100,NaN,NaN],";
		}
		echo ']';
		for ($i=0;$i<3;$i++)
			echo ',[]';
		echo '],';
		break;
	case 48:
		echo '"trous" : [';
		for ($j=0;$j<4;$j++) {
			if ($j)
				echo ',';
			echo '[';
			for ($i=0;$i<36;$i++) {
				$x = ($i%6)*100;
				$y = floor($i/6)*100;
				$u = $x+50;
				$v = $y+50;
				if ($arene["p$i"] != 10) {
					switch ($arene["p$i"]) {
					case 4:
						if ($j == 3)
							echo "[$x,".($y+63).",39,37,$u,$v],[".($x+61).",".($y+63).",39,37,$u,$v],[".($x+81).",".($y+21).",19,42,$u,$v],[".($x+39).",$y,61,21,$u,$v],[$x,$y,39,41,$u,$v],";
						break;
					case 5:
						if ($j == 0)
							echo "[".($x+63).",".($y+61).",37,39,$u,$v],[".($x+63).",$y,37,39,$u,$v],[".($x+21).",$y,42,19,$u,$v],[$x,$y,21,61,$u,$v],[$x,".($y+61).",41,39,$u,$v],";
						break;
					case 6:
						if ($j == 1)
							echo "[".($x+61).",$y,39,37,$u,$v],[$x,$y,39,37,$u,$v],[$x,".($y+37).",19,42,$u,$v],[$x,".($y+79).",61,21,$u,$v],[".($x+61).",".($y+59).",39,41,$u,$v],";
						break;
					case 7:
						if ($j == 2)
							echo "[$x,$y,37,39,$u,$v],[$x,".($y+61).",37,39,$u,$v],[".($x+37).",".($y+81).",42,19,$u,$v],[".($x+79).",".($y+39).",21,61,$u,$v],[".($x+59).",$y,41,39,$u,$v],";
						break;
					}
				}
				elseif (!$j)
					echo "[$x,$y,100,100,NaN,NaN],";
			}
			echo ']';
		}
		echo '],';
		break;
	case 49:
	case 50:
		echo '"horspistes" : {"eau":[';
		for ($i=0;$i<36;$i++) {
			$x = ($i%6)*100;
			$y = floor($i/6)*100;
			switch ($arene["p$i"]) {
			case 0:
				echo "[$x,$y,100,11],[[$x,".($y+89)."],[".($x+7).",".($y+93)."],[".($x+11).",".($y+100)."],[$x,".($y+100)."]],[[".($x+89).",".($y+100)."],[".($x+93).",".($y+93)."],[".($x+100).",".($y+89)."],[".($x+100).",".($y+100)."]],";
				break;
			case 1:
				echo "[$x,$y,11,100],[[".($x+89).",".($y+100)."],[".($x+93).",".($y+93)."],[".($x+100).",".($y+89)."],[".($x+100).",".($y+100)."]],[[".($x+100).",".($y+11)."],[".($x+93).",".($y+7)."],[".($x+89).",$y],[".($x+100).",$y]],";
				break;
			case 2:
				echo "[$x,".($y+89).",100,11],[[".($x+100).",".($y+11)."],[".($x+93).",".($y+7)."],[".($x+89).",$y],[".($x+100).",$y]],[[".($x+11).",$y],[".($x+7).",".($y+7)."],[$x,".($y+11)."],[$x,$y]],";
				break;
			case 3:
				echo "[".($x+89).",$y,11,100],[[".($x+11).",$y],[".($x+7).",".($y+7)."],[$x,".($y+11)."],[$x,$y]],[[$x,".($y+89)."],[".($x+7).",".($y+93)."],[".($x+11).",".($y+100)."],[$x,".($y+100)."]],";
				break;
			case 4:
				echo "[[".($x+11).",".($y+100)."],[".($x+7).",".($y+93)."],[$x,".($y+89)."],[$x,".($y+100)."]],[[$x,".($y+10)."],[".($x+38).",".($y+11)."],[".($x+68).",".($y+20)."],[".($x+81).",".($y+34)."],[".($x+89).",".($y+62)."],[".($x+90).",".($y+100)."],[".($x+100).",".($y+100)."],[".($x+100).",$y],[$x,$y]],";
				break;
			case 5:
				echo "[[".($x+100).",".($y+89)."],[".($x+93).",".($y+93)."],[".($x+89).",".($y+100)."],[".($x+100).",".($y+100)."]],[[".($x+10).",".($y+100)."],[".($x+11).",".($y+62)."],[".($x+20).",".($y+32)."],[".($x+34).",".($y+19)."],[".($x+62).",".($y+11)."],[".($x+100).",".($y+10)."],[".($x+100).",$y],[$x,$y],[$x,".($y+100)."]],";
				break;
			case 6:
				echo "[[".($x+89).",$y],[".($x+93).",".($y+7)."],[".($x+100).",".($y+11)."],[".($x+100).",$y]],[[".($x+100).",".($y+90)."],[".($x+62).",".($y+89)."],[".($x+32).",".($y+80)."],[".($x+19).",".($y+66)."],[".($x+11).",".($y+38)."],[".($x+10).",$y],[$x,$y],[$x,".($y+100)."],[".($x+100).",".($y+100)."]],";
				break;
			case 7:
				echo "[[$x,".($y+11)."],[".($x+7).",".($y+7)."],[".($x+11).",$y],[$x,$y]],[[".($x+90).",$y],[".($x+89).",".($y+38)."],[".($x+80).",".($y+68)."],[".($x+66).",".($y+81)."],[".($x+38).",".($y+89)."],[$x,".($y+90)."],[$x,".($y+100)."],[".($x+100).",".($y+100)."],[".($x+100).",$y]],";
				break;
			case 8:
				echo "[$x,$y,100,11],[$x,".($y+89).",100,11],";
				if ($map == 50)
					echo "[[67,11],[50,15],[33,11]],[[33,89],[50,86],[67,89]],";
				break;
			case 9:
				echo "[$x,$y,11,100],[".($x+89).",$y,11,100],";
				if ($map == 50)
					echo "[[11,33],[15,50],[11,67]],[[89,67],[86,50],[89,33]],";
				break;
			case 11:
				echo "[[$x,".($y+11)."],[".($x+7).",".($y+7)."],[".($x+11).",$y],[$x,$y]],[[".($x+89).",$y],[".($x+93).",".($y+7)."],[".($x+100).",".($y+11)."],[".($x+100).",$y]],[[$x,".($y+89)."],[".($x+7).",".($y+93)."],[".($x+11).",".($y+100)."],[$x,".($y+100)."]],[[".($x+89).",".($y+100)."],[".($x+93).",".($y+93)."],[".($x+100).",".($y+89)."],[".($x+100).",".($y+100)."]],";
				break;
			case 12:
				echo "[[".($x+90).",".($y+100)."],[".($x+90).",".($y+35)."],[".($x+85).",".($y+21)."],[".($x+73).",".($y+15)."],[".($x+61).",".($y+13)."],[".($x+39).",".($y+13)."],[".($x+29).",".($y+15)."],[".($x+15).",".($y+21)."],[".($x+10).",".($y+35)."],[".($x+10).",".($y+100)."],[$x,".($y+100)."],[$x,$y],[".($x+100).",$y],[".($x+100).",".($y+100)."]],";
				break;
			case 13:
				echo "[[".($x+100).",".($y+10)."],[".($x+35).",".($y+10)."],[".($x+21).",".($y+15)."],[".($x+15).",".($y+27)."],[".($x+13).",".($y+39)."],[".($x+13).",".($y+61)."],[".($x+15).",".($y+71)."],[".($x+21).",".($y+85)."],[".($x+35).",".($y+90)."],[".($x+100).",".($y+90)."],[".($x+100).",".($y+100)."],[$x,".($y+100)."],[$x,$y],[".($x+100).",$y]],";
				break;
			case 14:
				echo "[[".($x+10).",$y],[".($x+10).",".($y+65)."],[".($x+15).",".($y+79)."],[".($x+27).",".($y+85)."],[".($x+39).",".($y+87)."],[".($x+61).",".($y+87)."],[".($x+71).",".($y+85)."],[".($x+85).",".($y+79)."],[".($x+90).",".($y+65)."],[".($x+90).",$y],[".($x+100).",$y],[".($x+100).",".($y+100)."],[$x,".($y+100)."],[$x,$y]],";
				break;
			case 15:
				echo "[[$x,".($y+90)."],[".($x+65).",".($y+90)."],[".($x+79).",".($y+85)."],[".($x+85).",".($y+73)."],[".($x+87).",".($y+61)."],[".($x+87).",".($y+39)."],[".($x+85).",".($y+29)."],[".($x+79).",".($y+15)."],[".($x+65).",".($y+10)."],[$x,".($y+10)."],[$x,$y],[".($x+100).",$y],[".($x+100).",".($y+100)."],[$x,".($y+100)."]],";
				break;
			}
		}
		echo ']},';
		echo '"trous" : [';
		for ($j=0;$j<4;$j++) {
			if ($j)
				echo ',';
			echo '[';
			for ($i=0;$i<36;$i++) {
				$x = ($i%6)*100;
				$y = floor($i/6)*100;
				$u = $x+50;
				$v = $y+50;
				$replace = "$u,$v";
				switch ($arene["p$i"]) {
				case 0:
					switch ($j) {
					case 0:
						echo "[$x,$y,100,5,".($x+49).",".($y+49)."],";
						break;
					case 1:
						echo "[[[".($x+94).",".($y+100)."],[".($x+100).",".($y+94)."],[".($x+100).",".($y+100)."]],[".($x+49).",".($y+49)."]],";
						break;
					case 3:
						echo "[[[$x,".($y+94)."],[".($x+6).",".($y+100)."],[$x,".($y+100)."]],[".($x+49).",".($y+49)."]],";
						break;
					}
					break;
				case 1:
					switch ($j) {
					case 0:
						echo "[[[".($x+94).",".($y+100)."],[".($x+100).",".($y+94)."],[".($x+100).",".($y+100)."]],[".($x+49).",".($y+49)."]],";
						break;
					case 1:
						echo "[$x,$y,5,100,".($x+49).",".($y+49)."],";
						break;
					case 2:
						echo "[[[".($x+100).",".($y+6)."],[".($x+94).",$y],[".($x+100).",$y]],[".($x+49).",".($y+49)."]],";
						break;
					}
					break;
				case 2:
					switch ($j) {
					case 1:
						echo "[[[".($x+100).",".($y+6)."],[".($x+94).",$y],[".($x+100).",$y]],[".($x+49).",".($y+49)."]],";
						break;
					case 2:
						echo "[$x,".($y+95).",100,5,".($x+49).",".($y+49)."],";
						break;
					case 3:
						echo "[[[".($x+6).",$y],[$x,".($y+6)."],[$x,$y]],[".($x+49).",".($y+49)."]],";
						break;
					}
					break;
				case 3:
					switch ($j) {
					case 0:
						echo "[[[$x,".($y+94)."],[".($x+6).",".($y+100)."],[$x,".($y+100)."]],[".($x+49).",".($y+49)."]],";
						break;
					case 2:
						echo "[[[".($x+6).",$y],[$x,".($y+6)."],[$x,$y]],[".($x+49).",".($y+49)."]],";
						break;
					case 3:
						echo "[".($x+95).",$y,5,100,".($x+49).",".($y+49)."],";
						break;
					}
					break;
				case 4:
					if ($j === 3)
						echo "[[[$x,".($y+94)."],[".($x+6).",".($y+100)."],[$x,".($y+100)."]],[".($x+49).",".($y+49)."]],[[[$x,".($y+4)."],[".($x+54).",".($y+6)."],[".($x+81).",".($y+19)."],[".($x+94).",".($y+48)."],[".($x+96).",".($y+100)."],[".($x+100).",".($y+100)."],[".($x+100).",$y],[$x,$y]],[".($x+49).",".($y+49)."]],";
					break;
				case 5:
					if ($j === 0)
						echo "[[[".($x+94).",".($y+100)."],[".($x+100).",".($y+94)."],[".($x+100).",".($y+100)."]],[".($x+49).",".($y+49)."]],[[[".($x+4).",".($y+100)."],[".($x+6).",".($y+46)."],[".($x+19).",".($y+19)."],[".($x+48).",".($y+6)."],[".($x+100).",".($y+4)."],[".($x+100).",$y],[$x,$y],[$x,".($y+100)."]],[".($x+49).",".($y+49)."]],";
					break;
				case 6:
					if ($j === 1)
						echo "[[[".($x+100).",".($y+6)."],[".($x+94).",$y],[".($x+100).",$y]],[".($x+49).",".($y+49)."]],[[[".($x+100).",".($y+96)."],[".($x+46).",".($y+94)."],[".($x+19).",".($y+81)."],[".($x+6).",".($y+52)."],[".($x+4).",$y],[$x,$y],[$x,".($y+100)."],[".($x+100).",".($y+100)."]],[".($x+49).",".($y+49)."]],";
					break;
				case 7:
					if ($j === 2)
						echo "[[[".($x+6).",$y],[$x,".($y+6)."],[$x,$y]],[".($x+49).",".($y+49)."]],[[[".($x+96).",$y],[".($x+94).",".($y+54)."],[".($x+81).",".($y+81)."],[".($x+52).",".($y+94)."],[$x,".($y+96)."],[$x,".($y+100)."],[".($x+100).",".($y+100)."],[".($x+100).",$y]],[".($x+49).",".($y+49)."]],";
					break;
				case 8:
					if ($j === 3)
						echo "[$x,$y,100,5,".($x+49).",".($y+49)."],[$x,".($y+95).",100,5,".($x+49).",".($y+49)."],";
					break;
				case 9:
					if ($j === 2)
						echo "[$x,$y,5,100,".($x+49).",".($y+49)."],[".($x+95).",$y,5,100,".($x+49).",".($y+49)."],";
					break;
				case 10:
					if (!$j)
						echo "[$x,$y,100,100,NaN,NaN],";
					break;
				case 11:
					if ($j === 2)
						echo "[[[$x,".($y+6)."],[".($x+6).",$y],[$x,$y]],[".($x+49).",".($y+49)."]],[[[".($x+94).",$y],[".($x+100).",".($y+6)."],[".($x+100).",$y]],[".($x+49).",".($y+49)."]],[[[$x,".($y+94)."],[".($x+6).",".($y+100)."],[$x,".($y+100)."]],[".($x+49).",".($y+49)."]],[[[".($x+94).",".($y+100)."],[".($x+100).",".($y+94)."],[".($x+100).",".($y+100)."]],[".($x+49).",".($y+49)."]],";
					break;
				case 12:
					if ($j === 0)
						echo "[[[".($x+5).",".($y+100)."],[".($x+5).",".($y+27)."],[".($x+13).",".($y+13)."],[".($x+34).",".($y+7)."],[".($x+67).",".($y+7)."],[".($x+87).",".($y+13)."],[".($x+95).",".($y+27)."],[".($x+95).",".($y+100)."],[".($x+100).",".($y+100)."],[".($x+100).",$y],[$x,$y],[$x,".($y+100)."]],[".($x+49).",".($y+49)."]],";
					break;
				case 13:
					if ($j === 1)
						echo "[[[".($x+100).",".($y+95)."],[".($x+27).",".($y+95)."],[".($x+13).",".($y+87)."],[".($x+7).",".($y+66)."],[".($x+7).",".($y+33)."],[".($x+13).",".($y+13)."],[".($x+27).",".($y+5)."],[".($x+100).",".($y+5)."],[".($x+100).",$y],[$x,$y],[$x,".($y+100)."],[".($x+100).",".($y+100)."]],[".($x+49).",".($y+49)."]],";
					break;
				case 14:
					if ($j === 2)
						echo "[[[".($x+95).",$y],[".($x+95).",".($y+73)."],[".($x+87).",".($y+87)."],[".($x+66).",".($y+93)."],[".($x+33).",".($y+93)."],[".($x+13).",".($y+87)."],[".($x+5).",".($y+73)."],[".($x+5).",$y],[$x,$y],[$x,".($y+100)."],[".($x+100).",".($y+100)."],[".($x+100).",$y]],[".($x+49).",".($y+49)."]],";
					break;
				case 15:
					if ($j === 3)
						echo "[[[$x,".($y+5)."],[".($x+73).",".($y+5)."],[".($x+87).",".($y+13)."],[".($x+93).",".($y+34)."],[".($x+93).",".($y+67)."],[".($x+87).",".($y+87)."],[".($x+73).",".($y+95)."],[$x,".($y+95)."],[$x,".($y+100)."],[".($x+100).",".($y+100)."],[".($x+100).",$y],[$x,$y]],[".($x+49).",".($y+49)."]],";
					break;
				}
			}
			echo ']';
		}
		echo '],';
		echo '"sea":{"colors":{"water":"#A9EDE6","wave":"#CAFDFE","foam":"#fff"},"waves":';
		/*
		0 1
		2 3
		*/
		$graph = array(
			array( // 0
				'0.left' => array(
					'1.right',
					array(
						[[0,10],[100,10]],
						[[0,22],[25,26],[51,22],[76,26],[100,22]]
					)
				),
				'2.left' => array(
					'2.bottom',
					array(
						[[0,90],[7,93],[10,100]],
						[[0,79],[11,79],[21,89],[21,100]]
					)
				),
				'3.right' => array(
					'3.bottom',
					array(
						[[100,90],[93,93],[90,100]],
						[[100,79],[89,79],[79,88],[79,100]]
					)
				)
			), array( // 1
				'0.top' => array(
					'2.bottom',
					array(
						[[10,0],[10,100]],
						[[22,0],[26,25],[22,50],[26,75],[22,100]]
					)
				),
				'1.right' => array(
					'1.top',
					array(
						[[100,10],[93,7],[90,0]],
						[[100,21],[89,21],[79,11],[79,0]]
					)
				),
				'3.right' => array(
					'3.bottom',
					array(
						[[100,90],[93,93],[90,100]],
						[[100,79],[89,79],[79,89],[79,100]]
					)
				)
			), array( // 2
				'0.left' => array(
					'0.top',
					array(
						[[0,10],[7,7],[10,0]],
						[[0,22],[11,21],[21,11],[22,0]]
					)
				),
				'1.right' => array(
					'1.top',
					array(
						[[100,10],[93,7],[90,0]],
						[[100,22],[89,21],[79,11],[78,0]]
					)
				),
				'2.left' => array(
					'3.right',
					array(
						[[0,90],[100,90]],
						[[0,78],[25,74],[50,78],[75,74],[100,78]]
					)
				)
			), array( // 3
				'0.left' => array(
					'0.top',
					array(
						[[0,10],[7,7],[10,0]],
						[[0,22],[11,21],[21,11],[22,0]]
					)
				),
				'1.top' => array(
					'3.bottom',
					array(
						[[90,0],[90,100]],
						[[78,0],[74,25],[78,50],[74,75],[78,100]]
					)
				),
				'2.left' => array(
					'2.bottom',
					array(
						[[0,90],[7,93],[10,100]],
						[[0,78],[11,79],[21,89],[22,100]]
					)
				)
			), array( // 4
				'0.left' => array(
					'3.bottom',
					array(
						[[0,10],[41,10],[68,19],[81,32],[90,59],[90,100]],
						[[0,22],[36,27],[56,35],[65,44],[73,64],[78,100]]
					)
				),
				'2.left' => array(
					'2.bottom',
					array(
						[[0,90],[7,93],[10,100]],
						[[0,78],[11,79],[21,89],[22,100]]
					)
				)
			), array( // 5
				'1.right' => array(
					'2.bottom',
					array(
						[[100,10],[59,10],[32,19],[19,32],[10,59],[10,100]],
						[[100,22],[64,27],[44,35],[35,44],[27,64],[22,100]]
					)
				),
				'3.right' => array(
					'3.bottom',
					array(
						[[100,90],[93,93],[90,100]],
						[[100,78],[89,79],[79,89],[78,100]]
					)
				)
			), array( // 6
				'0.top' => array(
					'3.right',
					array(
						[[10,0],[10,41],[19,68],[32,81],[59,90],[100,90]],
						[[22,0],[27,36],[35,56],[44,65],[64,73],[100,78]]
					)
				),
				'1.top' => array(
					'1.right',
					array(
						[[90,0],[93,7],[100,10]],
						[[78,0],[79,11],[89,21],[100,22]]
					)
				)
			), array( // 7
				'0.left' => array(
					'0.top',
					array(
						[[0,10],[7,7],[10,0]],
						[[0,22],[11,21],[21,11],[22,0]]
					)
				),
				'1.top' => array(
					'2.left',
					array(
						[[90,0],[90,41],[81,68],[68,81],[41,90],[0,90]],
						[[78,0],[73,36],[65,56],[56,65],[36,73],[0,78]]
					)
				)
			), array( // 8
				'0.left' => array(
					'1.right',
					array(
						[[0,10],[100,10]],
						[[0,22],[25,26],[51,22],[76,26],[100,22]]
					)
				),
				'2.left' => array(
					'3.right',
					array(
						[[0,90],[100,90]],
						[[0,78],[25,74],[50,78],[75,74],[100,78]]
					)
				)
			), array( // 9
				'0.top' => array(
					'2.bottom',
					array(
						[[10,0],[10,100]],
						[[22,0],[26,25],[22,50],[26,75],[22,100]]
					)
				),
				'1.top' => array(
					'3.bottom',
					array(
						[[90,0],[90,100]],
						[[78,0],[74,25],[78,50],[74,75],[78,100]]
					)
				)
			), array( // 10
			), array( // 11
				'0.left' => array(
					'0.top',
					array(
						[[0,10],[7,7],[10,0]],
						[[0,22],[11,21],[21,11],[22,0]]
					)
				),
				'1.top' => array(
					'1.right',
					array(
						[[90,0],[93,7],[100,10]],
						[[78,0],[79,11],[89,21],[100,22]]
					)
				),
				'2.left' => array(
					'2.bottom',
					array(
						[[0,90],[7,93],[10,100]],
						[[0,79],[11,79],[21,89],[21,100]]
					)
				),
				'3.right' => array(
					'3.bottom',
					array(
						[[100,90],[93,93],[90,100]],
						[[100,79],[89,79],[79,88],[79,100]]
					)
				)
			), array( // 12
				'2.bottom' => array(
					'3.bottom',
					array(
						[[10,100],[10,32],[18,18],[40,12],[60,12],[82,18],[90,32],[90,100]],
						[[22,100],[26,75],[22,50],[25,38],[34,29],[51,26],[66,29],[75,39],[78,51],[74,75],[78,100]]
					)
				)
			), array( // 13
				'1.right' => array(
					'3.right',
					array(
						[[100,10],[32,10],[18,18],[12,40],[12,60],[18,82],[32,90],[100,90]],
						[[100,22],[75,26],[51,22],[39,25],[29,34],[26,49],[29,66],[38,75],[50,78],[75,74],[100,78]]
					)
				)
			), array( // 14
				'0.top' => array(
					'1.top',
					array(
						[[10,0],[10,68],[18,82],[40,88],[60,88],[82,82],[90,68],[90,0]],
						[[22,0],[26,25],[22,49],[25,61],[34,71],[49,74],[66,71],[75,62],[78,50],[74,25],[78,0]]
					)
				)
			), array( // 15
				'0.left' => array(
					'2.left',
					array(
						[[0,10],[68,10],[82,18],[88,40],[88,60],[82,82],[68,90],[0,90]],
						[[0,22],[25,26],[50,22],[62,25],[71,34],[74,51],[71,66],[61,75],[49,78],[25,74],[0,78]]
					)
				)
			)
		);
		if ($map == 50) {
			$graph[8] = array(
				'0.left' => array(
					'2.left',
					array(
						[[0,10],[24,10],[36,11],[50,15],[50,85],[35,89],[23,90],[0,90]],
						[[0,22],[12,25],[19,31],[23,42],[23,59],[19,69],[11,75],[0,78]]
					)
				),
				'1.right' => array(
					'3.right',
					array(
						[[100,10],[77,10],[64,11],[50,15],[50,85],[64,89],[75,90],[100,90]],
						[[100,22],[89,24],[79,33],[75,43],[75,57],[79,67],[90,76],[100,78]]
					)
				)
			);
			$graph[9] = array(
				'0.top' => array(
					'1.top',
					array(
						[[10,0],[10,23],[11,36],[15,50],[85,50],[89,36],[90,25],[90,0]],
						[[22,0],[24,11],[33,21],[43,25],[57,25],[67,21],[76,10],[78,0]]
					)
				),
				'2.bottom' => array(
					'3.bottom',
					array(
						[[10,100],[10,76],[11,64],[15,50],[85,50],[89,65],[90,77],[90,100]],
						[[22,100],[25,88],[31,81],[42,77],[59,77],[69,81],[75,89],[78,100]]
					)
				)
			);
			$graph[11] = array(
				'0.left' => array(
					'0.top',
					array(
						[[0,10],[7,7],[10,0]],
						[[0,22],[9,23],[18,28],[28,18],[23,9],[22,0]]
					)
				),
				'1.top' => array(
					'1.right',
					array(
						[[90,0],[93,7],[100,10]],
						[[79,0],[77,9],[70,20],[80,30],[91,23],[100,20]]
					)
				),
				'2.left' => array(
					'2.bottom',
					array(
						[[0,90],[7,93],[10,100]],
						[[0,78],[9,77],[18,72],[28,82],[23,91],[22,100]]
					)
				),
				'3.right' => array(
					'3.bottom',
					array(
						[[100,90],[93,93],[90,100]],
						[[100,78],[91,77],[82,72],[72,82],[77,91],[78,100]]
					)
				),
				'0.center' => array(
					'0.center',
					array(
						[[49.6,50],[49.7,49.7],[50,49.6],[50.3,49.7],[50.4,50],[50.3,50.3],[50,50.4],[49.7,50.3]],
						[[24,50],[23,39],[18,28],[28,18],[41,25],[50,27],[59,25],[70,20],[80,30],[75,41],[73,50],[75,59],[82,72],[72,82],[61,77],[50,76],[39,77],[28,82],[18,72],[23,61]]
					),
					array(
						'colors' => array(
							'water' => '#A9EDE6',
							'wave' => '#A9EDE6',
							'foam' => "#CAFDFE"
						)
					)
				)
			);
		}
		$orientedGraph = array();
		foreach ($graph as $i => $graphPieces) {
			$orientedGraph[$i] = array();
			foreach ($graphPieces as $in => $out) {
				$orientedGraph[$i][$in] = $out;
				$waves = $out[1];
				foreach ($waves as &$wave)
					$wave = array_reverse($wave);
				$orientedGraph[$i][$out[0]] = array($in,$waves);
				if (isset($out[2]))
					$orientedGraph[$i][$out[0]][] = $out[2];
			}
		}
		$graph = $orientedGraph;
		function createSeaFromGraph(&$state) {
			global $graph, $arene;
			foreach ($state['graph'] as $i_ => &$stateGraph) {
				foreach ($stateGraph as $in => &$data) {
					$i = $i_;
					if (null === $data['waves']) {
						$j = count($state['sea']);
						$newSea = array(array(),array());
						do {
							$graphData = $graph[$arene["p$i"]][$in];
							$out = $graphData[0];
							$state['graph'][$i][$in]['waves'] = $j;
							$state['graph'][$i][$out]['waves'] = $j;
							$x = ($i%6)*100;
							$y = floor($i/6)*100;
							foreach ($graphData[1] as $k=>$wave) {
								foreach ($wave as &$pt) {
									$pt[0] += $x;
									$pt[1] += $y;
								}
								unset($pt);
								$newSea[$k] = array_merge($newSea[$k],$wave);
							}
							$dir = explode(".",$out);
							$newDir = $dir;
							$newI = $i;
							switch ($dir[1]) {
							case 'top':
								$newI -= 6;
								$newDir[0] += 2;
								$newDir[1] = 'bottom';
								break;
							case 'bottom':
								$newI += 6;
								$newDir[0] -= 2;
								$newDir[1] = 'top';
								break;
							case 'left':
								if (!($newI%6))
									$newI = 0;
								$newI--;
								$newDir[0]++;
								$newDir[1] = 'right';
								break;
							case 'right':
								$newI++;
								if (!($newI%6))
									$newI = -1;
								$newDir[0]--;
								$newDir[1] = 'left';
								break;
							}
							$in = implode(".",$newDir);
							if (isset($state['graph'][$newI][$in])) {
								$i = $newI;
								foreach ($graphData[1] as $k=>$wave)
									array_pop($newSea[$k]);
							}
							else {
								$newDir = $dir;
								switch ($dir[1]) {
								case 'top':
								case 'bottom':
									$newDir[0] += ($newDir[0]%2) ? -1:1;
									break;
								case 'left':
								case 'right':
									$newDir[0] += ($newDir[0]>=2) ? -2:2;
								}
								$in = implode(".",$newDir);
							}
						} while (null === $state['graph'][$i][$in]['waves']);
						$state['sea'][] = $newSea;
						if (isset($graphData[2])) {
							if (isset($graphData[2]['colors'])) {
								$state['colors'][$j] = $graphData[2]['colors'];
							}
						}
					}
				}
				unset($data);
			}
			unset($stateGraph);
		}
		$state = array(
			'graph' => array(),
			'sea' => array(),
			'colors' => array()
		);
		for ($i=0;$i<36;$i++) {
			foreach ($graph[$arene["p$i"]] as $in => $out) {
				$state['graph'][$i][$in] = array(
					'waves' => null
				);
			}
		}
		createSeaFromGraph($state);
		//$state['sea'] = array($state['sea'][0]);
		//$state['sea'] = array_slice($state['sea'], 7,1);
		echo json_encode($state['sea']);
		foreach ($state['colors'] as $i=>$colors) {
			if ($colors)
				echo ',"colors.'.$i.'":'.json_encode($colors);
		}
		echo '},';
		break;
	}
	?>
	"aipoints" : [[
		<?php
		for ($i=0;$i<36;$i++) {
			$piece = $chemins[$i];
			echo '[';
			for ($j=0;$j<count($piece);$j++)
				echo $piece[$j].',';
			echo '],';
		}
		?>
	]],
	"arme" : [
		<?php
		for ($i=0; isset($arene['o'.$i]); $i++)
			echo '['.$arene['o'.$i].'],';
		?>
	],
	"sauts" : [
		<?php
		$elements = Array('e','f','g','h','i','j');
		for ($i=0;$i<6;$i++) {
			$e = $elements[$i];
			for ($j=0; isset($arene[$e.$j]); $j++) {
				echo '['.$arene[$e.$j].',';
				switch ($e) {
					case 'e' :
					echo '13,7';
					break;
					case 'f' :
					echo '7,13';
					break;
					case 'g' :
					echo '33,7';
					break;
					case 'h' :
					echo '7,33';
					break;
					case 'i' :
					echo '45,7';
					break;
					case 'j' :
					echo '7,45';
				}
				echo ',],';
			}
		}
		?>
	],
	"accelerateurs" : [
		<?php
		$elements = Array('a','b','c','d');
		for ($i=0;$i<4;$i++) {
			$e = $elements[$i];
			for ($j=0; isset($arene[$e.$j]); $j++)
				echo '['.$arene[$e.$j].'],';
			}
		?>
	],
	"startposition" : [
		<?php
		for ($i=0;$i<8;$i++)
			echo '['.($arene["s$i"]%6*100+50).','.(floor($arene["s$i"]/6)*100+50).','.$arene["r$i"].','.$arene["s$i"].'],';
		?>
	],
	"decor" : {
		<?php
		foreach ($decorTypes[$map] as $i=>$decorType) {
			if ($i) echo ',';
			echo '"'.$decorTypes[$map][$i].'":[';
			$prefix = 't'.($i ? $i.'_':'');
			for ($j=0; isset($circuit[$prefix.$j]); $j++) {
				if ($j) echo ',';
				echo '['.$circuit[$prefix.$j].']';
			}
			echo ']';
		}
		?>
		}
	}
	<?php
}
?>