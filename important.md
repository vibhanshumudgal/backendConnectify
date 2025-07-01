1->    agar "use" use karega to str matching se vo divert karta h the first route "/" h to sab yahi jaynge.
           /hello != /hello1 but /hello == /hello/123
           
2->    Use "get" cool h good h And yeh mat sochna phle "/ji" kiya h aur "/jiA" search kiya to "/ji" chala jayega. Cant get bolenga;
3->    app.get("", (req, res) => {
         res.send("DATA ALL");
         });    ** if "" -> "/ab?c" "/ab" work "/ac" work 
                ** if "" -> "/ab+c"  "/abbc" work "/abbbbbbbbbc" work "/abcd" nope
                ** if "" -> "/ab*c"  "/abxyzc" work "/abd" nope
                ** if "" -> "regexAlso"
4->  connect to monggoose 






