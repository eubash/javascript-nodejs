
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

Текущей версией является Gulp 3 и большинство руководств в интернете посвящены именно ему.

Однако в новой версии многое сделано более правильно, она обратно совместима и стабильна. 
Поэтому мы будем использовать её. 

В репозитарии Gulp есть ветка 4.0, в которой есть и сам код и документация и даже рецепты, уже адаптированные под Gulp 4. Так что на новой версии Gulp вы будете такие точно не одни :)
```

## Выпуски скринкаста

  
<div class="lessons-list lessons-list_screencast">
<ol class="lessons-list__lessons">
<li class="lessons-list__lesson" data-mnemo="what-is-gulp"><a href="#" data-video-id="nm6OG5ZjPaI">Что такое Gulp? Сравнение с Grunt и Webpack</a></li>
<li class="lessons-list__lesson" data-mnemo="basics"><a href="#" data-video-id="zahRnh-sh60">Установка и запуск задач</a></li>
<li class="lessons-list__lesson" data-mnemo="vinyl"><a href="#" data-video-id="RC0PcZlcQ_k">Потоки Vinyl-FS</a></li>
<li class="lessons-list__lesson" data-mnemo="stylus"><a href="#" data-video-id="9PjB_IFmXmI">Начальная сборка стилей</a></li>
<li class="lessons-list__lesson" data-mnemo="watch"><a href="#" data-video-id="0TjCBg6s6lM">Инкрементальная сборка, watch</a></li>
<li class="lessons-list__lesson" data-mnemo="watch-perf"><a href="#" data-video-id="lQPQmFNYJW0">Инкрементальность и производительность</a></li>
<li class="lessons-list__lesson" data-mnemo="browsersync"><a href="#" data-video-id="fneIejECVPQ">Автоперезагрузка браузера: browser-sync</a></li>
<li class="lessons-list__lesson" data-mnemo="errors"><a href="#" data-video-id="udG2Je-d1Ao">Обработка ошибок</a></li>
</ol>
</div>
 
Дальше планируются выпуски:

1. Стили с postcss.
2. Скрипты с webpack.
3. Написание своих gulp-плагинов.
4. Организация gulp-файла.

Напишите, если есть какие-либо пожелания или вопросы.

Вы также получите уведомления о выпусках, если подписаны на последнюю рассылку из списка ниже.

