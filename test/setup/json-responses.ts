// tslint:disable:max-line-length
export let warriorMovieJson = {
  'item': {
    'system': {
      'id': '325e2acb-1c14-47f6-af9a-27bc8b6c16fe',
      'name': 'Warrior',
      'codename': 'warrior',
      'language': 'en',
      'type': 'movie',
      'sitemap_locations': [
        'main_sitemap'
      ],
      'last_modified': '2017-06-21T12:22:09.1437891Z'
    },
    'elements': {
      'title': {
        'type': 'text',
        'name': 'Title',
        'value': 'Warrior'
      },
      'plot': {
        'type': 'rich_text',
        'name': 'Plot',
        'images': {},
        'links': {},
        'modular_content': [
          'tom_hardy',
          'joel_edgerton'
        ],
        'value': '<p>The youngest son of an alcoholic former boxer returns home, where he\'s trained by his father for competition in a mixed martial arts tournament - a path that puts the fighter on a collision course with his estranged, older brother.</p>\n<p>Stars:&nbsp;</p>\n<object type="application/kenticocloud" data-type="item" data-codename="tom_hardy"></object><object type="application/kenticocloud" data-type="item" data-codename="joel_edgerton"></object>'
      },
      'released': {
        'type': 'date_time',
        'name': 'Released',
        'value': '2011-09-09T00:00:00Z'
      },
      'length': {
        'type': 'number',
        'name': 'Length',
        'value': 151
      },
      'poster': {
        'type': 'asset',
        'name': 'Poster',
        'value': [
          {
            'name': 'warrior.jpg',
            'type': 'image/jpeg',
            'size': 0,
            'description': null,
            'url': 'https://assets.kenticocloud.com:443/da5abe9f-fdad-4168-97cd-b3464be2ccb9/22504ba8-2075-48fa-9d4f-8fce3de1754a/warrior.jpg'
          }
        ]
      },
      'category': {
        'type': 'multiple_choice',
        'name': 'Category',
        'value': [
          {
            'name': 'Action',
            'codename': 'action'
          },
          {
            'name': 'Drama',
            'codename': 'drama'
          }
        ]
      },
      'stars': {
        'type': 'modular_content',
        'name': 'Stars',
        'value': [
          'tom_hardy',
          'joel_edgerton'
        ]
      },
      'seoname': {
        'type': 'url_slug',
        'name': 'SeoName',
        'value': 'warrior'
      },
      'releasecategory': {
        'type': 'taxonomy',
        'name': 'ReleaseCategory',
        'taxonomy_group': 'releasecategory',
        'value': [
          {
            'name': 'Global release',
            'codename': 'global_release'
          }
        ]
      }
    }
  },
  'modular_content': {
    'tom_hardy': {
      'system': {
        'id': 'd1557cb1-d7ec-4d04-9742-f86b52bc34fc',
        'name': 'Tom Hardy',
        'codename': 'tom_hardy',
        'language': 'en',
        'type': 'actor',
        'sitemap_locations': [],
        'last_modified': '2017-06-02T10:19:23.8705332Z'
      },
      'elements': {
        'first_name': {
          'type': 'text',
          'name': 'First name',
          'value': 'Tom'
        },
        'last_name': {
          'type': 'text',
          'name': 'Last name',
          'value': 'Hardy'
        },
        'photo': {
          'type': 'asset',
          'name': 'Photo',
          'value': [
            {
              'name': 'tom_hardy.jpg',
              'type': 'image/jpeg',
              'size': 0,
              'description': null,
              'url': 'https://assets.kenticocloud.com:443/da5abe9f-fdad-4168-97cd-b3464be2ccb9/bb0899cf-2c3a-4e3f-8962-60e5a54fcca5/tom_hardy.jpg'
            }
          ]
        }
      }
    },
    'joel_edgerton': {
      'system': {
        'id': '3294e4b0-e58b-49d7-85fa-5bc9a86556ec',
        'name': 'Joel Edgerton',
        'codename': 'joel_edgerton',
        'language': 'en',
        'type': 'actor',
        'sitemap_locations': [],
        'last_modified': '2017-06-21T12:05:53.7889345Z'
      },
      'elements': {
        'first_name': {
          'type': 'text',
          'name': 'First name',
          'value': 'Joel'
        },
        'last_name': {
          'type': 'text',
          'name': 'Last name',
          'value': 'Edgerton'
        },
        'photo': {
          'type': 'asset',
          'name': 'Photo',
          'value': [
            {
              'name': 'joel_edgerton.jpg',
              'type': 'image/jpeg',
              'size': 0,
              'description': null,
              'url': 'https://assets.kenticocloud.com:443/da5abe9f-fdad-4168-97cd-b3464be2ccb9/2855720a-4ca4-4687-826a-29f9635088e0/joel_edgerton.jpg'
            }
          ]
        }
      }
    }
  }
}
