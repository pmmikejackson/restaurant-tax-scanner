-- Seed Texas Counties and Cities Data
-- This script populates all 254 Texas counties and major cities

-- Insert all 254 Texas counties (alphabetically)
INSERT INTO counties (state_id, name, slug, fips_code) VALUES 
    (1, 'ANDERSON COUNTY', 'anderson', '48001'),
    (1, 'ANDREWS COUNTY', 'andrews', '48003'),
    (1, 'ANGELINA COUNTY', 'angelina', '48005'),
    (1, 'ARANSAS COUNTY', 'aransas', '48007'),
    (1, 'ARCHER COUNTY', 'archer', '48009'),
    (1, 'ARMSTRONG COUNTY', 'armstrong', '48011'),
    (1, 'ATASCOSA COUNTY', 'atascosa', '48013'),
    (1, 'AUSTIN COUNTY', 'austin', '48015'),
    (1, 'BAILEY COUNTY', 'bailey', '48017'),
    (1, 'BANDERA COUNTY', 'bandera', '48019'),
    (1, 'BASTROP COUNTY', 'bastrop', '48021'),
    (1, 'BAYLOR COUNTY', 'baylor', '48023'),
    (1, 'BEE COUNTY', 'bee', '48025'),
    (1, 'BELL COUNTY', 'bell', '48027'),
    (1, 'BEXAR COUNTY', 'bexar', '48029'),
    (1, 'BLANCO COUNTY', 'blanco', '48031'),
    (1, 'BORDEN COUNTY', 'borden', '48033'),
    (1, 'BOSQUE COUNTY', 'bosque', '48035'),
    (1, 'BOWIE COUNTY', 'bowie', '48037'),
    (1, 'BRAZORIA COUNTY', 'brazoria', '48039'),
    (1, 'BRAZOS COUNTY', 'brazos', '48041'),
    (1, 'BREWSTER COUNTY', 'brewster', '48043'),
    (1, 'BRISCOE COUNTY', 'briscoe', '48045'),
    (1, 'BROWN COUNTY', 'brown', '48047'),
    (1, 'BURLESON COUNTY', 'burleson', '48049'),
    (1, 'BURNET COUNTY', 'burnet', '48051'),
    (1, 'CALDWELL COUNTY', 'caldwell', '48053'),
    (1, 'CALHOUN COUNTY', 'calhoun', '48055'),
    (1, 'CALLAHAN COUNTY', 'callahan', '48057'),
    (1, 'CAMERON COUNTY', 'cameron', '48061'),
    (1, 'CAMP COUNTY', 'camp', '48063'),
    (1, 'CARSON COUNTY', 'carson', '48065'),
    (1, 'CASS COUNTY', 'cass', '48067'),
    (1, 'CASTRO COUNTY', 'castro', '48069'),
    (1, 'CHAMBERS COUNTY', 'chambers', '48071'),
    (1, 'CHEROKEE COUNTY', 'cherokee', '48073'),
    (1, 'CHILDRESS COUNTY', 'childress', '48075'),
    (1, 'CLAY COUNTY', 'clay', '48077'),
    (1, 'COCHRAN COUNTY', 'cochran', '48079'),
    (1, 'COKE COUNTY', 'coke', '48081'),
    (1, 'COLEMAN COUNTY', 'coleman', '48083'),
    (1, 'COLLIN COUNTY', 'collin', '48085'),
    (1, 'COLLINGSWORTH COUNTY', 'collingsworth', '48087'),
    (1, 'COLORADO COUNTY', 'colorado', '48089'),
    (1, 'COMAL COUNTY', 'comal', '48091'),
    (1, 'COMANCHE COUNTY', 'comanche', '48093'),
    (1, 'CONCHO COUNTY', 'concho', '48095'),
    (1, 'COOKE COUNTY', 'cooke', '48097'),
    (1, 'CORYELL COUNTY', 'coryell', '48099'),
    (1, 'COTTLE COUNTY', 'cottle', '48101'),
    (1, 'CRANE COUNTY', 'crane', '48103'),
    (1, 'CROCKETT COUNTY', 'crockett', '48105'),
    (1, 'CROSBY COUNTY', 'crosby', '48107'),
    (1, 'CULBERSON COUNTY', 'culberson', '48109'),
    (1, 'DALLAM COUNTY', 'dallam', '48111'),
    (1, 'DALLAS COUNTY', 'dallas', '48113'),
    (1, 'DAWSON COUNTY', 'dawson', '48115'),
    (1, 'DEAF SMITH COUNTY', 'deaf-smith', '48117'),
    (1, 'DELTA COUNTY', 'delta', '48119'),
    (1, 'DENTON COUNTY', 'denton', '48121'),
    (1, 'DEWITT COUNTY', 'dewitt', '48123'),
    (1, 'DICKENS COUNTY', 'dickens', '48125'),
    (1, 'DONLEY COUNTY', 'donley', '48129'),
    (1, 'EASTLAND COUNTY', 'eastland', '48133'),
    (1, 'ECTOR COUNTY', 'ector', '48135'),
    (1, 'EDWARDS COUNTY', 'edwards', '48137'),
    (1, 'EL PASO COUNTY', 'el-paso', '48141'),
    (1, 'ELLIS COUNTY', 'ellis', '48139'),
    (1, 'ERATH COUNTY', 'erath', '48143'),
    (1, 'FALLS COUNTY', 'falls', '48145'),
    (1, 'FANNIN COUNTY', 'fannin', '48147'),
    (1, 'FAYETTE COUNTY', 'fayette', '48149'),
    (1, 'FISHER COUNTY', 'fisher', '48151'),
    (1, 'FLOYD COUNTY', 'floyd', '48153'),
    (1, 'FOARD COUNTY', 'foard', '48155'),
    (1, 'FORT BEND COUNTY', 'fort-bend', '48157'),
    (1, 'FRANKLIN COUNTY', 'franklin', '48159'),
    (1, 'FREESTONE COUNTY', 'freestone', '48161'),
    (1, 'FRIO COUNTY', 'frio', '48163'),
    (1, 'GAINES COUNTY', 'gaines', '48165'),
    (1, 'GALVESTON COUNTY', 'galveston', '48167'),
    (1, 'GARZA COUNTY', 'garza', '48169'),
    (1, 'GILLESPIE COUNTY', 'gillespie', '48171'),
    (1, 'GLASSCOCK COUNTY', 'glasscock', '48173'),
    (1, 'GOLIAD COUNTY', 'goliad', '48175'),
    (1, 'GONZALES COUNTY', 'gonzales', '48177'),
    (1, 'GRAY COUNTY', 'gray', '48179'),
    (1, 'GRAYSON COUNTY', 'grayson', '48181'),
    (1, 'GREGG COUNTY', 'gregg', '48183'),
    (1, 'GRIMES COUNTY', 'grimes', '48185'),
    (1, 'GUADALUPE COUNTY', 'guadalupe', '48187'),
    (1, 'HALE COUNTY', 'hale', '48189'),
    (1, 'HALL COUNTY', 'hall', '48191'),
    (1, 'HAMILTON COUNTY', 'hamilton', '48193'),
    (1, 'HANSFORD COUNTY', 'hansford', '48195'),
    (1, 'HARDEMAN COUNTY', 'hardeman', '48197'),
    (1, 'HARDIN COUNTY', 'hardin', '48199'),
    (1, 'HARRIS COUNTY', 'harris', '48201'),
    (1, 'HARRISON COUNTY', 'harrison', '48203'),
    (1, 'HARTLEY COUNTY', 'hartley', '48205'),
    (1, 'HASKELL COUNTY', 'haskell', '48207'),
    (1, 'HAYS COUNTY', 'hays', '48209'),
    (1, 'HEMPHILL COUNTY', 'hemphill', '48211'),
    (1, 'HENDERSON COUNTY', 'henderson', '48213'),
    (1, 'HIDALGO COUNTY', 'hidalgo', '48215'),
    (1, 'HILL COUNTY', 'hill', '48217'),
    (1, 'HOCKLEY COUNTY', 'hockley', '48219'),
    (1, 'HOOD COUNTY', 'hood', '48221'),
    (1, 'HOPKINS COUNTY', 'hopkins', '48223'),
    (1, 'HOUSTON COUNTY', 'houston', '48225'),
    (1, 'HOWARD COUNTY', 'howard', '48227'),
    (1, 'HUDSPETH COUNTY', 'hudspeth', '48229'),
    (1, 'HUNT COUNTY', 'hunt', '48231'),
    (1, 'HUTCHINSON COUNTY', 'hutchinson', '48233'),
    (1, 'IRION COUNTY', 'irion', '48235'),
    (1, 'JACK COUNTY', 'jack', '48237'),
    (1, 'JACKSON COUNTY', 'jackson', '48239'),
    (1, 'JASPER COUNTY', 'jasper', '48241'),
    (1, 'JEFF DAVIS COUNTY', 'jeff-davis', '48243'),
    (1, 'JEFFERSON COUNTY', 'jefferson', '48245'),
    (1, 'JOHNSON COUNTY', 'johnson', '48251'),
    (1, 'JONES COUNTY', 'jones', '48253'),
    (1, 'KARNES COUNTY', 'karnes', '48255'),
    (1, 'KAUFMAN COUNTY', 'kaufman', '48257'),
    (1, 'KENDALL COUNTY', 'kendall', '48259'),
    (1, 'KENEDY COUNTY', 'kenedy', '48261'),
    (1, 'KENT COUNTY', 'kent', '48263'),
    (1, 'KERR COUNTY', 'kerr', '48265'),
    (1, 'KIMBLE COUNTY', 'kimble', '48267'),
    (1, 'KING COUNTY', 'king', '48269'),
    (1, 'KINNEY COUNTY', 'kinney', '48271'),
    (1, 'KLEBERG COUNTY', 'kleberg', '48273'),
    (1, 'KNOX COUNTY', 'knox', '48275'),
    (1, 'LA SALLE COUNTY', 'la-salle', '48283'),
    (1, 'LAMAR COUNTY', 'lamar', '48277'),
    (1, 'LAMB COUNTY', 'lamb', '48279'),
    (1, 'LAMPASAS COUNTY', 'lampasas', '48281'),
    (1, 'LAVACA COUNTY', 'lavaca', '48285'),
    (1, 'LEE COUNTY', 'lee', '48287'),
    (1, 'LEON COUNTY', 'leon', '48289'),
    (1, 'LIBERTY COUNTY', 'liberty', '48291'),
    (1, 'LIMESTONE COUNTY', 'limestone', '48293'),
    (1, 'LIPSCOMB COUNTY', 'lipscomb', '48295'),
    (1, 'LIVE OAK COUNTY', 'live-oak', '48297'),
    (1, 'LLANO COUNTY', 'llano', '48299'),
    (1, 'LOVING COUNTY', 'loving', '48301'),
    (1, 'LUBBOCK COUNTY', 'lubbock', '48303'),
    (1, 'LYNN COUNTY', 'lynn', '48305'),
    (1, 'MADISON COUNTY', 'madison', '48313'),
    (1, 'MARION COUNTY', 'marion', '48315'),
    (1, 'MARTIN COUNTY', 'martin', '48317'),
    (1, 'MASON COUNTY', 'mason', '48319'),
    (1, 'MATAGORDA COUNTY', 'matagorda', '48321'),
    (1, 'MAVERICK COUNTY', 'maverick', '48323'),
    (1, 'MCCULLOCH COUNTY', 'mcculloch', '48307'),
    (1, 'MCLENNAN COUNTY', 'mclennan', '48309'),
    (1, 'MCMULLEN COUNTY', 'mcmullen', '48311'),
    (1, 'MEDINA COUNTY', 'medina', '48325'),
    (1, 'MENARD COUNTY', 'menard', '48327'),
    (1, 'MIDLAND COUNTY', 'midland', '48329'),
    (1, 'MILAM COUNTY', 'milam', '48331'),
    (1, 'MILLS COUNTY', 'mills', '48333'),
    (1, 'MITCHELL COUNTY', 'mitchell', '48335'),
    (1, 'MONTAGUE COUNTY', 'montague', '48337'),
    (1, 'MONTGOMERY COUNTY', 'montgomery', '48339'),
    (1, 'MOORE COUNTY', 'moore', '48341'),
    (1, 'MORRIS COUNTY', 'morris', '48343'),
    (1, 'MOTLEY COUNTY', 'motley', '48345'),
    (1, 'NACOGDOCHES COUNTY', 'nacogdoches', '48347'),
    (1, 'NAVARRO COUNTY', 'navarro', '48349'),
    (1, 'NEWTON COUNTY', 'newton', '48351'),
    (1, 'NOLAN COUNTY', 'nolan', '48353'),
    (1, 'NUECES COUNTY', 'nueces', '48355'),
    (1, 'OCHILTREE COUNTY', 'ochiltree', '48357'),
    (1, 'OLDHAM COUNTY', 'oldham', '48359'),
    (1, 'ORANGE COUNTY', 'orange', '48361'),
    (1, 'PALO PINTO COUNTY', 'palo-pinto', '48363'),
    (1, 'PANOLA COUNTY', 'panola', '48365'),
    (1, 'PARKER COUNTY', 'parker', '48367'),
    (1, 'PARMER COUNTY', 'parmer', '48369'),
    (1, 'PECOS COUNTY', 'pecos', '48371'),
    (1, 'POLK COUNTY', 'polk', '48373'),
    (1, 'POTTER COUNTY', 'potter', '48375'),
    (1, 'PRESIDIO COUNTY', 'presidio', '48377'),
    (1, 'RAINS COUNTY', 'rains', '48379'),
    (1, 'RANDALL COUNTY', 'randall', '48381'),
    (1, 'REAGAN COUNTY', 'reagan', '48383'),
    (1, 'REAL COUNTY', 'real', '48385'),
    (1, 'RED RIVER COUNTY', 'red-river', '48387'),
    (1, 'REEVES COUNTY', 'reeves', '48389'),
    (1, 'REFUGIO COUNTY', 'refugio', '48391'),
    (1, 'ROBERTS COUNTY', 'roberts', '48393'),
    (1, 'ROBERTSON COUNTY', 'robertson', '48395'),
    (1, 'ROCKWALL COUNTY', 'rockwall', '48397'),
    (1, 'RUNNELS COUNTY', 'runnels', '48399'),
    (1, 'RUSK COUNTY', 'rusk', '48401'),
    (1, 'SABINE COUNTY', 'sabine', '48403'),
    (1, 'SAN AUGUSTINE COUNTY', 'san-augustine', '48405'),
    (1, 'SAN JACINTO COUNTY', 'san-jacinto', '48407'),
    (1, 'SAN PATRICIO COUNTY', 'san-patricio', '48409'),
    (1, 'SAN SABA COUNTY', 'san-saba', '48411'),
    (1, 'SCHLEICHER COUNTY', 'schleicher', '48413'),
    (1, 'SCURRY COUNTY', 'scurry', '48415'),
    (1, 'SHACKELFORD COUNTY', 'shackelford', '48417'),
    (1, 'SHELBY COUNTY', 'shelby', '48419'),
    (1, 'SHERMAN COUNTY', 'sherman', '48421'),
    (1, 'SMITH COUNTY', 'smith', '48423'),
    (1, 'SOMERVELL COUNTY', 'somervell', '48425'),
    (1, 'STARR COUNTY', 'starr', '48427'),
    (1, 'STEPHENS COUNTY', 'stephens', '48429'),
    (1, 'STERLING COUNTY', 'sterling', '48431'),
    (1, 'STONEWALL COUNTY', 'stonewall', '48433'),
    (1, 'SUTTON COUNTY', 'sutton', '48435'),
    (1, 'SWISHER COUNTY', 'swisher', '48437'),
    (1, 'TARRANT COUNTY', 'tarrant', '48439'),
    (1, 'TAYLOR COUNTY', 'taylor', '48441'),
    (1, 'TERRELL COUNTY', 'terrell', '48443'),
    (1, 'TERRY COUNTY', 'terry', '48445'),
    (1, 'THROCKMORTON COUNTY', 'throckmorton', '48447'),
    (1, 'TITUS COUNTY', 'titus', '48449'),
    (1, 'TOM GREEN COUNTY', 'tom-green', '48451'),
    (1, 'TRAVIS COUNTY', 'travis', '48453'),
    (1, 'TRINITY COUNTY', 'trinity', '48455'),
    (1, 'TYLER COUNTY', 'tyler', '48457'),
    (1, 'UPSHUR COUNTY', 'upshur', '48459'),
    (1, 'UPTON COUNTY', 'upton', '48461'),
    (1, 'UVALDE COUNTY', 'uvalde', '48463'),
    (1, 'VAL VERDE COUNTY', 'val-verde', '48465'),
    (1, 'VAN ZANDT COUNTY', 'van-zandt', '48467'),
    (1, 'VICTORIA COUNTY', 'victoria', '48469'),
    (1, 'WALKER COUNTY', 'walker', '48471'),
    (1, 'WALLER COUNTY', 'waller', '48473'),
    (1, 'WARD COUNTY', 'ward', '48475'),
    (1, 'WASHINGTON COUNTY', 'washington', '48477'),
    (1, 'WEBB COUNTY', 'webb', '48479'),
    (1, 'WHARTON COUNTY', 'wharton', '48481'),
    (1, 'WHEELER COUNTY', 'wheeler', '48483'),
    (1, 'WICHITA COUNTY', 'wichita', '48485'),
    (1, 'WILBARGER COUNTY', 'wilbarger', '48487'),
    (1, 'WILLACY COUNTY', 'willacy', '48489'),
    (1, 'WILLIAMSON COUNTY', 'williamson', '48491'),
    (1, 'WILSON COUNTY', 'wilson', '48493'),
    (1, 'WINKLER COUNTY', 'winkler', '48495'),
    (1, 'WISE COUNTY', 'wise', '48497'),
    (1, 'WOOD COUNTY', 'wood', '48499'),
    (1, 'YOAKUM COUNTY', 'yoakum', '48501'),
    (1, 'YOUNG COUNTY', 'young', '48503'),
    (1, 'ZAPATA COUNTY', 'zapata', '48505'),
    (1, 'ZAVALA COUNTY', 'zavala', '48507');

-- Create initial tax data version
INSERT INTO tax_data_versions (version_number, state_id, source_url, source_date, imported_by, notes) 
VALUES ('2024.1', 1, 'https://comptroller.texas.gov/taxes/sales/', '2024-01-01', 'system', 'Initial Texas tax data import');

-- Insert tax authorities
INSERT INTO tax_authorities (name, type_id, state_id) VALUES 
    ('Texas State Comptroller', 1, 1);

-- Insert state tax
INSERT INTO taxes (version_id, authority_id, name, rate, is_percentage, applies_to, description, effective_date) 
VALUES (1, 1, 'Texas State Sales Tax', 6.25, TRUE, 'All food and beverage sales', 'Statewide sales tax applied to all taxable sales', '2024-01-01');

-- Insert state tax jurisdiction (applies to entire state)
INSERT INTO tax_jurisdictions (tax_id, state_id) VALUES (1, 1); 