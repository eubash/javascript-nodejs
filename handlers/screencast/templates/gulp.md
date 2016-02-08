
Gulp -- замечательная система сборки и задач, 
но при всём обилии информации в интернете о ней -- это, как правило, либо самые основы, либо "готовые решения".

В этом скринкасте я постараюсь восполнить этот "недостающий фрагмент". Не просто "вот такой код работает", а "почему и как он работает", и как его получить.

Дайте знать, если я рассказываю уж слишком подробно.
  
  
```warn header="Node.JS"
Для работы с Gulp необходимо знание Node.JS.

Хотя бы выпуски 1-9 (основы), 13 (события), 23-25 (потоки), а желательно -- и остальные выпуски первой части [скринкаста по Node.JS](/screencast/nodejs).
```

```smart header="Gulp 4"
В скринкасте используется новый Gulp версии 4. 

Текущей версией является Gulp 3, и большинство руководств в интернете посвящены именно ему.

Однако в новой версии многое сделано более правильно, она обратно совместима и стабильна. 
Поэтому мы будем использовать её. 

В репозитории Gulp есть ветка 4.0, в которой есть и сам код и документация и даже рецепты, уже адаптированные под Gulp 4. Так что на новой версии Gulp вы будете точно не один.
```

## Выпуски скринкаста

  
<div class="lessons-list lessons-list_screencast">
<ol class="lessons-list__lessons">
<li class="lessons-list__lesson" data-mnemo="01-what-is-gulp"><a href="#" data-video-id="uPk6lQoTThE">Что такое Gulp? Сравнение с Grunt и Webpack</a></li>
<li class="lessons-list__lesson" data-mnemo="02-basics"><a href="#" data-video-id="xptUdO3GuG8">Установка и запуск задач</a></li>
<li class="lessons-list__lesson" data-mnemo="03-vinyl"><a href="#" data-video-id="NBdKplKl_3Q">Потоки Vinyl-FS</a></li>
<li class="lessons-list__lesson" data-mnemo="04-stylus"><a href="#" data-video-id="_BFWG82mMkw">Начальная сборка стилей</a></li>
<li class="lessons-list__lesson" data-mnemo="05-watch"><a href="#" data-video-id="jocvHauHcA4">Инкрементальная сборка, watch</a></li>
<li class="lessons-list__lesson" data-mnemo="06-watch-perf"><a href="#" data-video-id="uYZPNrT-e-8">Инкрементальность и производительность</a></li>
<li class="lessons-list__lesson" data-mnemo="07-browsersync"><a href="#" data-video-id="oiMJNIG-yvg">Автоперезагрузка браузера: browser-sync</a></li>
<li class="lessons-list__lesson" data-mnemo="08-errors"><a href="#" data-video-id="otkXzef2wQY">Обработка ошибок</a></li>
</ol>
</div>
 
Код примеров -- в репозитории <https://github.com/iliakan/gulp-screencast>.
 
Дальше планируются выпуски:

1. Стили с postcss.
2. Скрипты с webpack.
3. Написание своих gulp-плагинов.
4. Организация gulp-файла.
5. Что-то ещё? Ничего важного не забыл?

Напишите, если есть какие-либо пожелания или вопросы.

Вы также получите уведомления о выпусках, если подписаны на последнюю рассылку из списка ниже.

