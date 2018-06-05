import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as glob from 'glob';
import * as hbs from 'hbs';
import * as hblayouts from 'handlebars-layouts';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const dir = __dirname + '/**/views';
  glob(dir , (err, directories) => {
    app.set('views', directories);
    app.setViewEngine('hbs');
    app.useStaticAssets(__dirname + '/public');
  });

  glob(dir + '/partials' , (err, directories) => {
    directories.forEach(fdir => hbs.registerPartials(fdir));
  });

  hbs.registerHelper('layouts', hblayouts(hbs.handlebars));

  await app.listen(3000);
}
bootstrap();
